import { cloneDeep } from 'lodash';
import { SELECT, SET_RESOLUTION, SET_MODE, 
  SET_MARKER, UPDATE_MARKER, DELETE_MARKER,
  SET_SELECTED,
  } from '../actions/types';

const initialState = {
  selection: {
    from: null,
    to: null
  },
  markersById: {},
  resolution: 1000,
  mode: "moveMode",
  selectedPart: null,
};

export default (state = initialState, action) => {
  switch (action.type) {

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
            id: action.payload.markerId,
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
      const currentPos = state.markersById[action.payload.markerId] ? state.markersById[action.payload.markerId].pos : 0;
      const currentType = state.markersById[action.payload.markerId] ? state.markersById[action.payload.markerId].type : "normal";
      return {
        ...state,
        markersById: {
          ...state.markersById,
          [action.payload.markerId]: {
            id: action.payload.markerId,
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
      
    case SET_SELECTED:
      const selPart = action.payload.selected ? action.payload : null;
      return {
        ...state,
        selectedPart: selPart
      }

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
  return state.view.selectedPart;
}
