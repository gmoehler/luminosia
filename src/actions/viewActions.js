import {
  SELECT_RANGE, DESELECT_RANGE, SET_RESOLUTION, CLEAR_VIEW,
  SELECT_IMAGE_CHANNEL, ADD_TO_UPLOAD_LOG, CLEAR_UPLOAD_LOG, SET_MESSAGE,
  CLEAR_MESSAGE, INIT_LOAD_PROGRESS, SET_LOAD_PROGRESS, INCR_LOAD_PROGRESS,
  TOGGLE_SNAP_TO_MARKER
} from "./types";
import { getAllChannelIds, getChannelSampleRate } from "../reducers/channelReducer";
import { updateChannel } from "./channelActions";
import { pixelsToSeconds } from "../utils/conversions";

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

const _setResolution = (resolution) => ({
  type: SET_RESOLUTION,
  payload: resolution
});

export const setResolution = (resolution) => {
  return (dispatch, getState) => {
    dispatch(_setResolution(resolution));
    getAllChannelIds(getState()).forEach((channelId) =>
      dispatch(updateChannel({
        channelId,
        minPartDuration: pixelsToSeconds(5, resolution,
          getChannelSampleRate(getState(), channelId)),
        snapDist: pixelsToSeconds(10, resolution,
          getChannelSampleRate(getState(), channelId)),
      })));
  };
};

export const selectImageChannel = (channelId) => ({
  type: SELECT_IMAGE_CHANNEL,
  payload: channelId
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

export const toggleSnapToMarkers = () => ({
  type: TOGGLE_SNAP_TO_MARKER,
});