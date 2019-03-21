import { SELECT_RANGE, DESELECT_RANGE, SET_RESOLUTION, 
  UPDATE_MARKER, SET_MARKER, DELETE_MARKER, SELECT_PART_OR_IMAGE, 
  DESELECT_PART_OR_IMAGE, CLEAR_VIEW, SELECT_IMAGE_CHANNEL, COPY_PART } from "./types";

import { getSelectedPart, getSelectedImage } from "../reducers/viewReducer";

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

const setSelected = (partOrImageInfo) => ({
  type: SELECT_PART_OR_IMAGE,
  payload: partOrImageInfo
});

export const deselect = () => ({
  type: DESELECT_PART_OR_IMAGE,
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
  const markerIdPrefix = `${part.channelId}-${part.partId}`;
  dispatch(updateMarker({
    markerId: markerIdPrefix + "-l",
    channelId: part.channelId,
    partId: part.partId,
    incr: 0,
    type
  }));
  dispatch(updateMarker({
    markerId: markerIdPrefix + "-r",
    channelId: part.channelId,
    partId: part.partId,
    incr: 0,
    type
  }));
};

// partinfo is channelld, partId and selected
// imageinfo is imageId
export const selectPartOrImage = ((partOrImageInfo) => {
  return (dispatch, getState) => {
    const curSelPart = getSelectedPart(getState());
    const curSelImage = getSelectedImage(getState());

    if (curSelPart) {
      // de-select markers of currently selected part
      const curUnselPart = {
        ...curSelPart
      };
      curUnselPart.selected = false;
      updateMarkers(dispatch, curUnselPart);

      // clicked on selected part to deselect
      if (curSelPart.channelId === partOrImageInfo.channelId &&
        curSelPart.partId === partOrImageInfo.partId) {
        dispatch(deselect());
        return;
      }
    }

    if (curSelImage) {
      // clicked on selected image to deselect
      if (curSelImage.imageId === partOrImageInfo.imageId) {
        dispatch(deselect());
        return;
      }
    }

    // clicked on unselected part
    dispatch(setSelected(partOrImageInfo));
    dispatch(selectImageChannel(partOrImageInfo));
    if (partOrImageInfo.partId) {
      // for parts only
      updateMarkers(dispatch, partOrImageInfo);
    }
  };
});

