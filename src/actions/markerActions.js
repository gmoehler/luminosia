import {
  CLEAR_MARKERS, SET_OR_REPLACE_MARKER, DELETE_MARKER, UPDATE_MARKER,
} from "./types";
import { aMarkerExists } from "../reducers/markerReducer";

export const clearMarkers = () => ({
  type: CLEAR_MARKERS,
});

const _setOrReplaceMarker = (markerInfo) => ({
  type: SET_OR_REPLACE_MARKER,
  payload: markerInfo
});

// only exported for test
export function _setOrReplaceAMarker(markerInfo) {
  return (dispatch, getState) => {
    // required fields
    if (markerInfo.markerId && markerInfo.pos && markerInfo.type) {
      dispatch(_setOrReplaceMarker({
        ...markerInfo
      }));
    }
    return null;
  };
}
;

export function setOrReplaceInsertMarker(pos) {
  return (dispatch, getState) => {
    dispatch(_setOrReplaceAMarker({
      markerId: "insertMarker",
      pos,
      type: "insert"
    }));
  };
}
;

const _deleteMarker = (markerId) => ({
  type: DELETE_MARKER,
  payload: markerId
});

export function deleteAMarker(markerId) {
  return (dispatch, getState) => {
    if (aMarkerExists(getState(), markerId)) {
      dispatch(_deleteMarker(markerId));
    }
  };
}
;

const _updateMarker = (markerInfo) => ({
  type: UPDATE_MARKER,
  payload: markerInfo
});

export const updateAMarker = (markerInfo) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions
    // update marker position either by incr or pos
    // or update type
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

////////////////////////////////////
// actions in relation with parts //
////////////////////////////////////

// helpers to generate marker info from part
function _getMarkerId(partId, type) {
  return `${partId}--${type}`;
}

function _getPartLeftMarkerId(partId) {
  return _getMarkerId(partId, "left");
}

function _getSelectedLeftMarker(partInfo) {
  return {
    markerId: _getPartLeftMarkerId(partInfo.partId),
    pos: partInfo.offset,
    type: "selected",
    channelId: partInfo.channelId,
    partId: partInfo.partId
  };
}

function _getPartRightMarkerId(partId) {
  return _getMarkerId(partId, "right");
}

function _getSelectedRightMarker(partInfo) {
  return {
    markerId: _getPartRightMarkerId(partInfo.partId),
    pos: partInfo.offset + partInfo.duration,
    type: "selected",
    channelId: partInfo.channelId,
    partId: partInfo.partId
  };
}

// actions

export const addPartSelectionMarkers = (partInfo) => {
  return (dispatch, getState) => {
    const leftMarker = _getSelectedLeftMarker(partInfo);
    dispatch(_setOrReplaceAMarker(leftMarker));
    const rightMarker = _getSelectedRightMarker(partInfo);
    dispatch(_setOrReplaceAMarker(rightMarker));
  };
};

export const deletePartSelectionMarkers = (partId) => {
  return (dispatch, getState) => {
    const leftMarkerId = _getPartLeftMarkerId(partId);
    dispatch(deleteAMarker(leftMarkerId));
    const rightMarkerId = _getPartRightMarkerId(partId);
    dispatch(deleteAMarker(rightMarkerId));
  };
};

export const syncPartMarkers = (part) => {
  return (dispatch, getState) => {
    // will only update, when markers exist
    const leftMarkerId = _getPartLeftMarkerId(part.partId);
    dispatch(updateAMarker({
      pos: part.offset,
      markerId: leftMarkerId
    }));
    const rightMarkerId = _getPartRightMarkerId(part.partId);
    dispatch(updateAMarker({
      pos: part.offset + part.duration,
      markerId: rightMarkerId
    }));
  };
};
