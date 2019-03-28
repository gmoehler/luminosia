import { SELECT_RANGE, DESELECT_RANGE, SET_RESOLUTION, UPDATE_MARKER, SET_MARKER, DELETE_MARKER, CLEAR_VIEW, SELECT_IMAGE_CHANNEL, COPY_PART, ADD_ELEMENT_TO_SEL, REMOVE_ELEMENT_FROM_SEL, CLEAR_SEL } from "./types";

import { isElementSelected, getSelectedElements, getNumSelectedElements, getSelectionType, getSelectedParts } from "../reducers/viewReducer";

import { cloneDeep } from "lodash";
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

const updateMarkers = (dispatch, part) => {
  const type = part.selected ? "selected" : "normal";
  const markerIdPrefix = `${part.partId}`;
  const incr = part.incr || 0;
  dispatch(updateMarker({
    markerId: markerIdPrefix + "-l",
    channelId: part.channelId,
    partId: part.partId,
    incr,
    type
  }));
  dispatch(updateMarker({
    markerId: markerIdPrefix + "-r",
    channelId: part.channelId,
    partId: part.partId,
    incr,
    type
  }));
};

export const updateSelectedMarkers = (moveInfo) => {
  return (dispatch, getState) => {
    getSelectedParts(getState()).forEach((part) => {
      updateMarkers(dispatch, {
        ...part,
        incr: moveInfo.incr,
        selected: true,
      }
      );
    });
  };
};

export const toggleElementSelection = ((elementInfo) => {
  return (dispatch, getState) => {

    dispatch(selectImageChannel(elementInfo));

    const elemSelected = isElementSelected(getState(), elementInfo);
    const numElemSelected = getNumSelectedElements(getState());

    dispatch(clearSelectionWithMarkers());

    if (!elemSelected || numElemSelected !== 1) {
      dispatch(addElemToSel(elementInfo));
      // marker updates for parts only
      if (getElementType(elementInfo) === "part") {
        const elCopy = {
          ...elementInfo,
          selected: true
        };
        updateMarkers(dispatch, elCopy);
      }
    }
  };
});

// remove markers (parts only) and clear selection
const clearSelectionWithMarkers = () => {
  return (dispatch, getState) => {
    // remove markers for parts only
    if (getSelectionType(getState()) === "part") {
      getSelectedElements(getState()).forEach((el) => {
        el.selected = false;
        updateMarkers(dispatch, el);
      });
    }
    dispatch(clearSel());
  };
};

export const toggleElementMultiSelection = ((elementInfo) => {
  return (dispatch, getState) => {

    dispatch(selectImageChannel(elementInfo));
    const elCopy = cloneDeep(elementInfo);

    // only keeps elements of the same type selected
    // remove selection if element type difers
    if (getElementType(elementInfo) !== getSelectionType(getState())) {
      dispatch(clearSelectionWithMarkers());
    }

    if (isElementSelected(getState(), elementInfo)) {
      dispatch(remElemFromSel(elementInfo));
      if (getElementType(elementInfo) === "part") {
        elCopy.selected = false;
        updateMarkers(dispatch, elCopy);
      }
    } else {
      dispatch(addElemToSel(elementInfo));
      if (getElementType(elementInfo) === "part") {
        elCopy.selected = true;
        updateMarkers(dispatch, elCopy);
      }
    }
  };
});

export const addPartToMultiSelection = ((elementInfo) => {
  return (dispatch, getState) => {
    if (!isElementSelected(getState(), elementInfo)) {
      const elCopy = cloneDeep(elementInfo);
      dispatch(addElemToSel(elementInfo));
      if (getElementType(elementInfo) === "part") {
        elCopy.selected = true;
        updateMarkers(dispatch, elCopy);
      }
    }
  };
});