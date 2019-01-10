import { SELECT, SET_RESOLUTION, SET_MODE, 
	UPDATE_MARKER, SET_MARKER, DELETE_MARKER,
	SET_SELECTED,
} from './types';

import { getSelectedPart } from '../reducers/viewReducer';

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

// keeps type when type is null
export const updateMarker = (markerInfo) => ({
  type: UPDATE_MARKER,
  payload: markerInfo
});

const setSelected = (partInfo) => ({
  type: SET_SELECTED,
  payload: partInfo
});

const updateMarkers = (dispatch, partInfo) => {
    const type = partInfo.selected ? "selected" : "";
    dispatch(updateMarker(`${partInfo.channelId}-${partInfo.partId}-l`, 0, type));
    return dispatch(updateMarker(`${partInfo.channelId}-${partInfo.partId}-r`, 0, type));
  }

export const selectPart = ((partInfo) => {
  return (dispatch, getState) => {
  	const curSelPart = getSelectedPart(getState());
  	// de-select markers of prev selected part
  	if (curSelPart && (curSelPart.channelId !== partInfo.channelId ||
  		curSelPart.channelId !== partInfo.channelId)){
  		curSelPart.selected = false;
  		updateMarkers(dispatch, curSelPart);
  	}
  	// remember newly selected part
  	dispatch(setSelected(partInfo));
  	return updateMarkers(dispatch, partInfo) ;
  }
});


