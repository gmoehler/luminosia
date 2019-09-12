import {
  CLEAR_MARKERS, SET_OR_REPLACE_A_MARKER, DELETE_A_MARKER,
  UPDATE_A_MARKER,
} from "./types";
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
    if (markerInfo.markerId && markerInfo.pos && markerInfo.type) {
      dispatch(_setOrReplaceMarker({
        ...markerInfo
      }));
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

export function deleteAMarker(markerId) {
  return (dispatch, getState) => {
    if (aMarkerExists(getState(), markerId)) {
      dispatch(_deleteMarker(markerId));
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

////////////////////////////////////
// actions in relation with parts //
////////////////////////////////////

// helpers to generate marker info from part
function _getMarkerId(partId, type) {
  return `${partId}--${type}`;
}

function _getPartLeftMarkerId(partId) {
  return _getMarkerId({
    partId: partId,
    type: "left",
  });
}

function _getSelectedLeftMarker(partInfo) {
  return {
    markerId: _getPartLeftMarkerId(partInfo.partId),
    pos: partInfo.offset,
    type: "selected"
  };
}

function _getPartRightMarkerId(partId) {
  return _getMarkerId({
    partId: partId,
    type: "right",
  });
}

function _getSelectedRightMarker(partInfo) {
  return {
    markerId: _getPartRightMarkerId(partInfo.partId),
    pos: partInfo.offset + partInfo.duration,
    type: "selected"
  };
}

// actions

export const addPartSelectionMarkers = (partInfo) => {
  return (dispatch, getState) => {
    const leftMarker = _getSelectedLeftMarker(partInfo);
    dispatch(setOrReplaceAMarker(leftMarker));
    const rightMarker = _getSelectedRightMarker(partInfo);
    dispatch(setOrReplaceAMarker(rightMarker));
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


