import { CLEAR_MARKERS, SET_OR_REPLACE_A_MARKER, DELETE_A_MARKER, UPDATE_A_MARKER, } from "./types";
import { aMarkerExists } from "../reducers/markerReducer";

export const clearMarkers = () => ({
  type: CLEAR_MARKERS,
});

const _setOrReplaceMarker = (markerInfo) => ({
  type: SET_OR_REPLACE_A_MARKER,
  payload: markerInfo
});

export function setOrReplaceAMarker(markerInfo) {
  return (dispatch, getState) => {
    // required fields
    if (markerInfo.type && markerInfo.pos) {
      let markerId = markerInfo.markerId;
      if (!markerId) {
        // add markerId based on type and partId
        // or use type (mainly for "insert" marker)
        markerId = markerInfo.partId ?
          `${markerInfo.partId}--${markerInfo.type}` : markerInfo.type;
      }
      dispatch(_setOrReplaceMarker({
        ...markerInfo,
        markerId
      }));
      return markerId;
    }
    return null;
  };
};

export function setSelectionMarkers(partId) {

}

const _deleteMarker = (markerId) => ({
  type: DELETE_A_MARKER,
  payload: markerId
});

export function deleteAMarker(imageId) {
  return (dispatch, getState) => {
    if (aMarkerExists(getState(), imageId)) {
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
      if (aMarkerExists(getState(), markerInfo.markerId) && (
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


