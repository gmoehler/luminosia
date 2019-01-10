import { cloneDeep } from 'lodash';
import { SELECT, SET_RESOLUTION, SET_MODE, SET_MARKER, UPDATE_MARKER, DELETE_MARKER } from '../actions/types';

const initialState = {
  selection: {
    from: null,
    to: null
  },
  markersById: {},
  resolution: 1000,
  mode: "moveMode",
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
      return {
        ...state,
        markersById: {
          ...state.markersById,
          [action.payload.markerId]: {
            id: action.payload.markerId,
            pos: currentPos + action.payload.incr,
            type: action.payload.type,
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