import { SELECT, SET_RESOLUTION, SET_MODE, UPDATE_MARKER, SET_MARKER, DELETE_MARKER } from './types';

// load audio async action


export const select = (selectInfo) => ({
  type: SELECT,
  payload: selectInfo
});

export const setResolution = (resolutionInfo) => ({
  type: SET_RESOLUTION,
  payload: resolutionInfo
});

export const setMode = (modeInfo) => ({
  type: SET_MODE,
  payload: modeInfo
})

export const setMarker = (markerInfo) => ({
  type: SET_MARKER,
  payload: markerInfo
});

export const deleteMarker = (markerInfo) => ({
  type: DELETE_MARKER,
  payload: markerInfo
});

export const updateMarker = (markerInfo) => ({
  type: UPDATE_MARKER,
  payload: markerInfo
});

