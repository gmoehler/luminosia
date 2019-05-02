import { SELECT_RANGE, DESELECT_RANGE, SET_RESOLUTION, UPDATE_MARKER, SET_MARKER, DELETE_MARKER, CLEAR_VIEW, 
  SELECT_IMAGE_CHANNEL, COPY_PART, ADD_ELEMENT_TO_SEL, REMOVE_ELEMENT_FROM_SEL, CLEAR_SEL } from "./types";

import { isElementSelected, getSelectedElements, getNumSelectedElements, getSelectionType, getSelectedParts } from "../reducers/viewReducer";

import { getElementType } from "../reducers/channelReducer";

export const clearView = () => ({
  type: CLEAR_VIEW
});

export const selectRange = (selectInfo) => ({
  type: SELECT_RANGE,
  payload: selectInfo
});

export const deselectRange = () => ({
  type: DESELECT_RANGE
});

export const setResolution = (resolutionInfo) => ({
  type: SET_RESOLUTION,
  payload: resolutionInfo
});

export const setMarker = (markerInfo) => ({
  type: SET_MARKER,
  payload: markerInfo
});

export const deleteMarker = (markerInfo) => ({
  type: DELETE_MARKER,
  payload: markerInfo
});

// keeps type when type is null
export const updateMarker = (markerInfo) => ({
  type: UPDATE_MARKER,
  payload: markerInfo
});

const addElemToSel = (elementInfo) => ({
  type: ADD_ELEMENT_TO_SEL,
  payload: elementInfo
});

export const remElemFromSel = (elementInfo) => ({
  type: REMOVE_ELEMENT_FROM_SEL,
  payload: elementInfo
});

export const clearSel = () => ({
  type: CLEAR_SEL
});

export const selectImageChannel = (channelInfo) => ({
  type: SELECT_IMAGE_CHANNEL,
  payload: channelInfo
});

export const copyPart = () => ({
  type: COPY_PART
});

// should contain partId and update info (inc or type)
export const updateMarkersForPart = (partId, updateInfo) => {
  return (dispatch, getState) => {
    const type = updateInfo.selected ? "selected" : "normal"; 
    const markerIdPrefix = `${partId}`;
      dispatch(updateMarker({
        markerId: markerIdPrefix + "-l",
        incr: updateInfo.incr,
        type
      }));
      dispatch(updateMarker({
        markerId: markerIdPrefix + "-r",
        incr: updateInfo.incr,
        type
      }));
  };
};

export const updateSelectedMarkers = (moveInfo) => {
  return (dispatch, getState) => {
    getSelectedParts(getState()).forEach((part) => {
      dispatch(updateMarkersForPart(part.partId, {
        incr: moveInfo.incr,
        selected: true,
      }));
    });
  };
};

// method to select/deselect an element with always one being selected
// (e.g. on simple click)
export const toggleElementSelection = ((elementInfo) => {
  return (dispatch, getState) => {

    // always select the channel
    dispatch(selectImageChannel(elementInfo));

    const elemSelected = isElementSelected(getState(), elementInfo);
    const numElemSelected = getNumSelectedElements(getState());

    dispatch(clearElementSelectionWithMarkers());

    if (!elemSelected || numElemSelected !== 1) {
      dispatch(addElemToSel(elementInfo));
      // marker updates for parts only
      if (getElementType(elementInfo) === "part") {
        dispatch(updateMarkersForPart(elementInfo.partId, { selected: true }));
      }
    }
  };
});

// remove markers (parts only) and clear selection
export const clearElementSelectionWithMarkers = () => {
  return (dispatch, getState) => {
    // remove markers for parts only
    if (getSelectionType(getState()) === "part") {
      getSelectedElements(getState()).forEach((el) => {
        dispatch(updateMarkersForPart(el.partId, { selected: false }));
      });
    }
    // clear element selection in one shot
    dispatch(clearSel());
  };
};

// method to add/remove an element to selection 
// (e.g. on ctrl click)
export const toggleElementMultiSelection = ((elementInfo) => {
  return (dispatch, getState) => {

    // always update channel selection
    dispatch(selectImageChannel(elementInfo));

    // only keeps elements of the same type selected
    // remove selection if element type difers
    if (getElementType(elementInfo) !== getSelectionType(getState())) {
      dispatch(clearElementSelectionWithMarkers());
    }

    if (isElementSelected(getState(), elementInfo)) {
      dispatch(remElemFromSel(elementInfo));
      if (getElementType(elementInfo) === "part") {
        dispatch(updateMarkersForPart(elementInfo.partId, { selected: false }));
      }
    } else {
      dispatch(addElemToSel(elementInfo));
      if (getElementType(elementInfo) === "part") {
        dispatch(updateMarkersForPart(elementInfo.partId, { selected: true }));
      }
    }
  };
});

// simple and fast add routine - no checks
export const addPartToMultiSelection = ((elementInfo) => {
  return (dispatch, getState) => {
    dispatch(addElemToSel(elementInfo));
    dispatch(updateMarkersForPart(elementInfo.partId, { selected: true }));
  };
});

export const addToUploadLog = (text) => ({
  type: ADD_TO_UPLOAD_LOG,
  payload: text
});

export const clearUploadLog = () => ({
  type: CLEAR_UPLOAD_LOG
});
