import { SELECT, SET_RESOLUTION, SET_MODE, 
	UPDATE_MARKER, SET_MARKER, DELETE_MARKER,
	SET_SELECTED, DESELECT
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

export const deselect = () => ({
  type: DESELECT,
});

const updateMarkers = (dispatch, part) => {
  const type = part.selected ? "selected" : "normal";
  const markerIdPrefix = `${part.channelId}-${part.partId}`;
  dispatch(updateMarker({markerId: markerIdPrefix+"-l", incr: 0, type}));
  dispatch(updateMarker({markerId: markerIdPrefix+"-r", incr: 0, type}));
}

export const selectPart = ((partInfo) => {
  return (dispatch, getState) => {
    const curSelPart = getSelectedPart(getState());
    
  	if (curSelPart) {
      // de-select markers of currently selected part
      const curUnselPart = {...curSelPart};
      curUnselPart.selected = false;
      updateMarkers(dispatch, curUnselPart);

    // clicked on selected part to deselect
    if (curSelPart.channelId === partInfo.channelId &&
      curSelPart.partId === partInfo.partId){
      dispatch(deselect());
      return;
    } 
  } 

  // clicked on unselected part
  dispatch(setSelected(partInfo));
  updateMarkers(dispatch, partInfo);
  }
});


