import {
  CLEAR_MARKERS, SET_OR_REPLACE_MARKER, DELETE_MARKER, UPDATE_MARKER,
} from "./types";
import { markerExists, getAllMarkers } from "../reducers/markerReducer";

// first id will be 1 to avoid falsy ids
let lastMarkerIdCount = 0;

// should only be used with care (e.g. in tests)
export function _setInitialMarkerIdCount(newId) {
  lastMarkerIdCount = newId;
}

function generateId() {
  // simple generator :-)
  // other options: cuid or uuid
  lastMarkerIdCount++;
  return "marker-" + lastMarkerIdCount.toString();
}

function isValidMarkerType(type) {
  return ["insert", "selected", "timeScale", "insertTimeScale"]
    .includes(type);
}

export const clearMarkers = () => ({
  type: CLEAR_MARKERS,
});

export function clearMarkersOfType(type) {
  return (dispatch, getState) => {
    if (isValidMarkerType(type)) {
      Object.values(getAllMarkers(getState())).forEach((marker) => {
        if (marker.type === type) {
          dispatch(_deleteMarker(marker.markerId));
        }
      });
    } else {
      console.error("cannot clear markers of unknown type:", type);
    }
  };
}

const _setOrReplaceMarker = (markerInfo) => ({
  type: SET_OR_REPLACE_MARKER,
  payload: markerInfo
});

export function setOrReplaceMarker(markerInfo) {
  return (dispatch, getState) => {
    // required fields
    if (typeof markerInfo.pos == "number" &&
      isValidMarkerType(markerInfo.type)) {
      if (!markerInfo.markerId) {
        markerInfo.markerId = generateId();
      }
      dispatch(_setOrReplaceMarker({
        ...markerInfo
      }));
      return markerInfo.markerId;
    }
    console.error("cannot set or replace incomplete marker:", markerInfo);
    return null;
  };
}

export function setOrReplaceInsertMarker(pos) {
  return (dispatch, getState) => {
    dispatch(setOrReplaceMarker({
      markerId: "insertMarker", // just one allowed
      pos,
      type: "insert"
    }));
  };
}

const _deleteMarker = (markerId) => ({
  type: DELETE_MARKER,
  payload: markerId
});

export function deleteMarker(markerId) {
  return (dispatch, getState) => {
    if (markerExists(getState(), markerId)) {
      dispatch(_deleteMarker(markerId));
    }
  };
}

const _updateMarker = (markerInfo) => ({
  type: UPDATE_MARKER,
  payload: markerInfo
});

export const updateMarker = (markerInfo) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions
    // update marker position either by incr or pos
    // or update type
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
    dispatch(setOrReplaceMarker(leftMarker));
    const rightMarker = _getSelectedRightMarker(partInfo);
    dispatch(setOrReplaceMarker(rightMarker));
  };
};

export const deletePartSelectionMarkers = (partId) => {
  return (dispatch, getState) => {
    const leftMarkerId = _getPartLeftMarkerId(partId);
    dispatch(deleteMarker(leftMarkerId));
    const rightMarkerId = _getPartRightMarkerId(partId);
    dispatch(deleteMarker(rightMarkerId));
  };
};

export const syncPartMarkers = (part) => {
  return (dispatch, getState) => {
    // will only update, when markers exist
    const leftMarkerId = _getPartLeftMarkerId(part.partId);
    dispatch(updateMarker({
      pos: part.offset,
      markerId: leftMarkerId
    }));
    const rightMarkerId = _getPartRightMarkerId(part.partId);
    dispatch(updateMarker({
      pos: part.offset + part.duration,
      markerId: rightMarkerId
    }));
  };
};
