import {SELECT, SET_ZOOM_LEVEL, SET_MODE, SET_MARKER, UPDATE_MARKER} from '../actions/types';

const initialState = {
  selection: {
    from: null,
    to: null
  },
  markersById: {},
  zoomLevel: 1000,
  mode: "selectionMode",
};

export default(state = initialState, action) => {
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
          [action.payload.markerId] : {
            id: action.payload.markerId,
            pos: action.payload.pos,
          }
        }
      };

    case UPDATE_MARKER:
      const currentPos = state.markersById[action.payload.markerId] && state.markersById[action.payload.markerId].pos;
      return {
        ...state,
        markersById: {
          ...state.markersById,
          [action.payload.markerId] : {
            id: action.payload.markerId,
            pos: currentPos + action.payload.incr,
          }
        }
      };

    case SET_ZOOM_LEVEL:
      return {
        ...state,
        zoomLevel: action.payload
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

export const getZoomLevel = (state) => {
  return state.view.zoomLevel
}

export const getMode = (state) => {
  return state.view.mode
}

export const getMarkers = (state) => {
  return state.view.markersById ? Object.values(state.view.markersById) : [];
}