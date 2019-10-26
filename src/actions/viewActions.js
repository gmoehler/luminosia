import { SELECT_RANGE, DESELECT_RANGE, SET_RESOLUTION, CLEAR_VIEW, SELECT_IMAGE_CHANNEL, COPY_PART, ADD_TO_UPLOAD_LOG, CLEAR_UPLOAD_LOG, SET_MESSAGE, CLEAR_MESSAGE, INIT_LOAD_PROGRESS, SET_LOAD_PROGRESS, INCR_LOAD_PROGRESS } from "./types";

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

export const selectImageChannel = (channelInfo) => ({
  type: SELECT_IMAGE_CHANNEL,
  payload: channelInfo
});

export const copyPart = () => ({
  type: COPY_PART
});

export const addToUploadLog = (text) => ({
  type: ADD_TO_UPLOAD_LOG,
  payload: text
});

export const clearUploadLog = () => ({
  type: CLEAR_UPLOAD_LOG
});

export const setMessage = (text) => ({
  type: SET_MESSAGE,
  payload: text
});

export const clearMessage = () => ({
  type: CLEAR_MESSAGE
});

export const initLoadProgress = (base) => ({
  type: INIT_LOAD_PROGRESS,
  payload: base,
});

export const setLoadProgress = (progress) => ({
  type: SET_LOAD_PROGRESS,
  payload: progress,
});

export const incrLoadProgress = (incr) => ({
  type: INCR_LOAD_PROGRESS,
  payload: incr,
});