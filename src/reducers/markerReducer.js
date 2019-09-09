import { cloneDeep } from "lodash";
import { CLEAR_MARKERS, SET_A_MARKER, DELETE_A_MARKER, UPDATE_A_MARKER, } from "../actions/types";
import { combineReducers } from "redux";

export const initialState = {
  byMarkerId: {},
  allMarkerIds: []
};

const byMarkerId = (state = {}, action) => {
  switch (action.type) {

    case CLEAR_MARKERS:
      return {};

    case SET_A_MARKER:
      return {
        ...state,
        [action.payload.markerId]: action.payload
      };

    case DELETE_A_MARKER:
      const newByMarkerId = cloneDeep(state);
      delete newByMarkerId[action.payload];
      return newByMarkerId;

    case UPDATE_A_MARKER:
      // update marker type, and pos by either incr or pos
      // expecting markerId, and incr or pos or type
      // if marker does not yet exist: do nothing
      const prevMarker = state[action.payload.markerId];
      let pos = prevMarker.pos;
      if (action.payload.incr) {
        pos = Math.max(prevMarker.pos + action.payload.incr, prevMarker.minPos);
      } else if (typeof action.payload.pos == "number") {
        pos = action.payload.pos;
      }
      const type = action.payload.type ? action.payload.type : prevMarker.type;
      return {
        ...state,
        [action.payload.markerId]: {
          ...prevMarker,
          pos,
          type
        }
      };

    default:
      return state;
  }
};

const allMarkerIds = (state = [], action) => {
  switch (action.type) {

    case CLEAR_MARKERS:
      return [];

    case SET_A_MARKER:
      return [...state, action.payload.markerId];

    case DELETE_A_MARKER:
      const newAllMarkerIds = [...state];
      newAllMarkerIds.splice(state.indexOf(action.payload), 1); // ids
      return newAllMarkerIds;

    case UPDATE_A_MARKER:
      return state;

    default:
      return state;
  }
};

export default combineReducers({
  byMarkerId,
  allMarkerIds,
});


export const getMarkers = (state) => {
  return Object.values(state.entities.markers.byMarkerId);
};

export const markerExists = (state, id) =>
  state.entities.markers.allMarkerIds.includes(id);