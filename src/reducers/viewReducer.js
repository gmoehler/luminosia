import { cloneDeep } from 'lodash';
import { CLEAR_VIEW, SELECT, SET_RESOLUTION, SET_MODE, 
    SET_MARKER, UPDATE_MARKER, DELETE_MARKER, 
    SELECT_PART_OR_IMAGE, DESELECT_PART_OR_IMAGE
} from '../actions/types';

// export for tests
export const initialState = {
  selection: {
    from: null,
    to: null
  },
  markersById: {},
  resolution: 80,
  mode: "moveMode",
  selectedPartOrImage: null,
  currentById: {},
};

export default (state = initialState, action) => {
  switch (action.type) {

    case CLEAR_VIEW:
      return initialState;

    case SELECT:
      return {
        ...state,
        selection: {
          from: action.payload.from,
          to: action.payload.to
        }
      };

    case SET_MARKER:
      return {
        ...state,
        markersById: {
          ...state.markersById,
          [action.payload.markerId]: {
            markerId: action.payload.markerId,
            pos: action.payload.pos,
            type: action.payload.type,
          }
        }
      };

    case DELETE_MARKER:
      const markers = cloneDeep(state.markersById);
      delete markers[action.payload.markerId];

      return {
        ...state,
        markersById: markers
      };

    case UPDATE_MARKER:
      // update marker type and pos by incr
      const currentPos = state.markersById[action.payload.markerId] ? state.markersById[action.payload.markerId].pos : 0;
      const currentType = state.markersById[action.payload.markerId] ? state.markersById[action.payload.markerId].type : "normal";
      return {
        ...state,
        markersById: {
          ...state.markersById,
          [action.payload.markerId]: {
            markerId: action.payload.markerId,
            pos: currentPos + action.payload.incr,
            type: action.payload.type ? action.payload.type : currentType,
          }
        }
      };

    case SET_RESOLUTION:
      return {
        ...state,
        resolution: action.payload
      }

    case SET_MODE:
      return {
        ...state,
        mode: action.payload
      }

    case SELECT_PART_OR_IMAGE:
      const selPartOrImage = action.payload.selected ? action.payload : null;
      return {
        ...state,
        selectedPartOrImage: selPartOrImage
      }

    case DESELECT_PART_OR_IMAGE:
      return {
        ...state,
        selectedPartOrImage: null
      };

    default:
      return state
  }
}

export const getSelectionRange = (state) => {
  return {
    from: state.view.selection.from,
    to: state.view.selection.to,
  }
}

export const getResolution = (state) => {
  return state.view.resolution
}

export const getMode = (state) => {
  return state.view.mode
}

export const getMarkers = (state) => {
  return state.view.markersById ? Object.values(state.view.markersById) : [];
}

export const getSelectedPart = (state) => {
  if (state.view.selectedPartOrImage &&
    state.view.selectedPartOrImage.partId) {
    return state.view.selectedPartOrImage;
  }
  return null;
}

export const getSelectedImage = (state) => {
  if (state.view.selectedPartOrImage &&
    state.view.selectedPartOrImage.imageId) {
    return state.view.selectedPartOrImage;
  }
  return null
}

export const getCurrent = (state) => {
  return state.view.currentById;
}