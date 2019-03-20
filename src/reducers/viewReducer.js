import { cloneDeep } from "lodash";
import { CLEAR_VIEW, SELECT_RANGE, DESELECT_RANGE, SET_RESOLUTION, 
  SET_MARKER, UPDATE_MARKER, DELETE_MARKER, SELECT_PART_OR_IMAGE, 
  DESELECT_PART_OR_IMAGE, SELECT_IMAGE_CHANNEL, COPY_PART } from "../actions/types";

// export for tests
export const initialState = {
  selection: {
    from: null,
    to: null
  },
  byMarkerId: {},
  resolution: 80,
  selectedPartOrImage: null,
  currentById: {},
  selectedImageChannelId: null,
  partToCopy: null,
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
            markerId: action.payload.markerId,
            channelId: action.payload.channelId,
            partId: action.payload.partId,
            pos: action.payload.pos,
            minPos: action.payload.minPos || 0,
            type: action.payload.type,
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
      // update marker type and pos by incr (no change in minPos)
      const currentPos = state.byMarkerId[action.payload.markerId] ? state.byMarkerId[action.payload.markerId].pos : 0;
      const currentMinPos = state.byMarkerId[action.payload.markerId] ? state.byMarkerId[action.payload.markerId].minPos : 0;
      const currentType = state.byMarkerId[action.payload.markerId] ? state.byMarkerId[action.payload.markerId].type : "normal";
      return {
        ...state,
        byMarkerId: {
          ...state.byMarkerId,
          [action.payload.markerId]: {
            markerId: action.payload.markerId,
            channelId: action.payload.channelId,
            partId: action.payload.partId,
            pos: Math.max(currentPos + action.payload.incr, currentMinPos),
            minPos: currentMinPos,
            type: action.payload.type ? action.payload.type : currentType,
          }
        }
      };

    case SET_RESOLUTION:
      return {
        ...state,
        resolution: action.payload
      };

    case SELECT_PART_OR_IMAGE:
      const selPartOrImage = action.payload.selected ? action.payload : null;
      return {
        ...state,
        selectedPartOrImage: selPartOrImage
      };

    case DESELECT_PART_OR_IMAGE:
      return {
        ...state,
        selectedPartOrImage: null
      };

    case COPY_PART:
      const partToCopy = state.selectedPartOrImage && state.selectedPartOrImage.partId ? 
        Object.assign({},state.selectedPartOrImage) : null;
      delete partToCopy.selected; // dont need that
      return {
        ...state,
        partToCopy
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

export const getSelectedPart = (state) => {
  if (state.view.selectedPartOrImage &&
    state.view.selectedPartOrImage.partId) {
    return state.view.selectedPartOrImage;
  }
  return null;
};

export const getPartToCopy = (state) => {
  return state.view.partToCopy;
};

export const getSelectedImage = (state) => {
  if (state.view.selectedPartOrImage &&
    state.view.selectedPartOrImage.imageId) {
    return state.view.selectedPartOrImage;
  }
  return null;
};

export const getCurrent = (state) => {
  return state.view.currentById;
};

export const getSelectedImageChannelId = (state) => {
  return state.view.selectedImageChannelId;
};