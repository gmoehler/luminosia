import { cloneDeep } from "lodash";
import { CLEAR_VIEW, SELECT_RANGE, DESELECT_RANGE, SET_RESOLUTION, SET_MARKER, UPDATE_MARKER, DELETE_MARKER, SELECT_IMAGE_CHANNEL, COPY_PART, ADD_ELEMENT_TO_SEL, REMOVE_ELEMENT_FROM_SEL, CLEAR_SEL, ADD_TO_UPLOAD_LOG, CLEAR_UPLOAD_LOG, SET_MESSAGE, CLEAR_MESSAGE } from "../actions/types";
import { getElementType } from "./channelReducer";

// export for tests
export const initialState = {
  selection: {
    from: null,
    to: null
  },
  byMarkerId: {},
  resolution: 80,
  selectedElementsById: {},
  selectedImageChannelId: null,
  partsToCopy: null,
  uploadLog: null,
  message: null,
};

export default (state = initialState, action) => {
  switch (action.type) {

    case CLEAR_VIEW:
      return initialState;

    case SELECT_RANGE:
      return {
        ...state,
        selection: {
          from: action.payload.from,
          to: action.payload.to
        }
      };

    case DESELECT_RANGE:
      return {
        ...state,
        selection: {
          from: null,
          to: null
        }
      };

    case SELECT_IMAGE_CHANNEL:
      return {
        ...state,
        selectedImageChannelId: action.payload.channelId
      };

    case SET_MARKER:
      return {
        ...state,
        byMarkerId: {
          ...state.byMarkerId,
          [action.payload.markerId]: {
            ...action.payload,
            minPos: action.payload.minPos || 0,
          }
        }
      };

    case DELETE_MARKER:
      const markers = cloneDeep(state.byMarkerId);
      delete markers[action.payload.markerId];

      return {
        ...state,
        byMarkerId: markers
      };

    case UPDATE_MARKER:
      // update marker type, and pos by either incr or pos
      // expecting markerId, and incr or pos or type
      // if marker does not yet exist: do nothing
      if (!state.byMarkerId[action.payload.markerId]) {
        return state;
      }
      const prevMarker = state.byMarkerId[action.payload.markerId];
      let pos = prevMarker.pos;
      if (action.payload.incr) {
        pos = Math.max(prevMarker.pos + action.payload.incr, prevMarker.minPos) ;
      } else if (typeof action.payload.pos == "number") {
        pos = action.payload.pos;
      }
      const type = action.payload.type ? action.payload.type : prevMarker.type;
      return {
        ...state,
        byMarkerId: {
          ...state.byMarkerId,
          [action.payload.markerId]: {
            ...prevMarker,
            pos,
            type
          }
        }
      };

    case SET_RESOLUTION:
      return {
        ...state,
        resolution: action.payload
      };

    case ADD_ELEMENT_TO_SEL:
      const selElement = action.payload;
      const id0 = action.payload.partId ? action.payload.partId : action.payload.imageId;
      if (id0) { // should always be true
        return {
          ...state,
          selectedElementsById: {
            ...state.selectedElementsById,
            [id0]: selElement
          }
        };
      } else {
        return state;
      }

    case REMOVE_ELEMENT_FROM_SEL:
      const id1 = action.payload.partId ? action.payload.partId : action.payload.imageId;
      const newSelectedElementsById = cloneDeep(state.selectedElementsById);
      delete newSelectedElementsById[id1];
      return {
        ...state,
        selectedElementsById: newSelectedElementsById
      };

    case CLEAR_SEL:
      return {
        ...state,
        selectedElementsById: {}
      };

    case COPY_PART:
      if (_getSelectionType(state) !== "part") {
        return state;
      }
      // duplicate parts array
      const partsToCopy = _getSelectedElements(state).slice(0);
      return {
        ...state,
        partsToCopy
      };

    case ADD_TO_UPLOAD_LOG:
      return {
        ...state,
        uploadLog: state.uploadLog ? state.uploadLog + action.payload : action.payload
      };

    case CLEAR_UPLOAD_LOG:
      return {
        ...state,
        uploadLog: null
      };

    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload
      };

    case CLEAR_MESSAGE:
      return {
        ...state,
        message: null
      };

    default:
      return state;
  }
};

export const getSelectionRange = (state) => {
  return {
    from: state.view.selection.from,
    to: state.view.selection.to,
  };
};

export const getResolution = (state) => {
  return state.view.resolution;
};

export const getMarkers = (state) => {
  return state.view.byMarkerId ? Object.values(state.view.byMarkerId) : [];
};

export const getPartsToCopy = (state) => {
  return state.view.partsToCopy;
};

export const getSelectedImage = (state) => {
  if (state.view.selectedPartOrImage &&
    state.view.selectedPartOrImage.imageId) {
    return state.view.selectedPartOrImage;
  }
  return null;
};

export const getSelectedImageChannelId = (state) => state.view.selectedImageChannelId;

export const isElementSelected = (state, elementInfo) => {
  return Object.keys(state.view.selectedElementsById).includes(elementInfo.partId) ||
    Object.keys(state.view.selectedElementsById).includes(elementInfo.imageId);
};

const _getSelectedElements = (viewState) => Object.values(viewState.selectedElementsById);
export const getSelectedElements = (state) => _getSelectedElements(state.view);

export const getSelectedImages = (state) => getSelectedElements(state).filter((elem) => elem.imageId != null);
export const getSelectedImageIds = (state) => getSelectedImages(state).map((img) => img.imageId);
export const getSelectedParts = (state) => getSelectedElements(state).filter((elem) => elem.partId != null);

const _getNumSelectedElements = (viewState) => viewState.selectedElementsById ?
  Object.values(viewState.selectedElementsById).length : 0;

export const getNumSelectedElements = (state) => _getNumSelectedElements(state.view);

const _getSelectionType = (viewState) => {
  if (_getNumSelectedElements(viewState) === 0)
    return null;
  const firstSelElem = _getSelectedElements(viewState)[0];
  return getElementType(firstSelElem);
};
export const getSelectionType = (state) => _getSelectionType(state.view);

export const getUploadLog = (state) => state.view.uploadLog;

export const getMessage = (state) => state.view.message;
