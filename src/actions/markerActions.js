import { CLEAR_MARKERS, SET_A_MARKER, DELETE_A_MARKER, UPDATE_A_MARKER, } from "./types";
import { markerExists } from "../reducers/markerReducer";

export const clearMarkers = () => ({
  type: CLEAR_MARKERS,
});

const _setMarker = (markerInfo) => ({
  type: SET_A_MARKER,
  payload: markerInfo
});

export function setAMarker(markerInfo) {
  return (dispatch, getState) => {
    // required fields
    if (markerInfo.type && markerInfo.pos) {
      let markerId = markerInfo.markerId;
      if (!markerId) {
        // add markerId based on type and partId
        markerId = markerInfo.partId ?
          `${markerInfo.partId}--${markerInfo.type}` : markerInfo.type;
      }
      dispatch(_setMarker({
        ...markerInfo,
        markerId
      }));
      return markerId;
    }
    return null;
  };
};

const _deleteMarker = (markerId) => ({
  type: DELETE_A_MARKER,
  payload: markerId
});

export function deleteAMarker(imageId) {
  return (dispatch, getState) => {
    if (markerExists(getState(), imageId)) {
      dispatch(_deleteMarker(imageId));
    }
  };
};

const _updateMarker = (markerInfo) => ({
  type: UPDATE_A_MARKER,
  payload: markerInfo
});

export const updateAMarker = (markerInfo) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions
    if (markerInfo.markerId) {
      if (markerExists(getState(), markerInfo.markerId) && (
        markerInfo.incr ||
        typeof markerInfo.pos == "number" ||
        markerInfo.type)) {
        dispatch(_updateMarker(markerInfo));
      }
    } else {
      console.error("marker does not have enough information to be updated:", markerInfo);
    }
  };
};


