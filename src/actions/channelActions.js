import LoaderFactory from '../loader/LoaderFactory'

import { PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE, MOVE_CHANNEL, 
  ADD_PART, DELETE_PART, ADD_CHANNEL, CLEAR_CHANNELS, UPLOAD_AUDIO_STARTED, UPLOAD_AUDIO_SUCCESS, UPLOAD_AUDIO_FAILURE
} from './types';

import { setMarker, deleteMarker, deselect, selectPartOrImage } from './viewActions';

import { getLastPartId, getLastChannelId } from '../reducers/channelReducer';
import { getSelectedPart, getSelectedImage } from '../reducers/viewReducer';
import { getImageDuration } from '../reducers/imageListReducer';
import { removeImage } from './imageListActions';
import { defaultSampleRate } from '../components/ImageListContainer';
import { readAudioFile } from '../utils/fileUtils';

// load channel from config

export const addChannel = channelInfo => ({
  type: ADD_CHANNEL,
  payload: channelInfo
});

export const addImageChannel = () => {
  return (dispatch, getState) => {
    dispatch(addChannel({
      type: "image",
      sampleRate: defaultSampleRate,
      playState: "stopped",
    }));
  }
};

export const deleteImageChannel = () => {
  return (dispatch, getState) => {
   // TODO   
  }
};

export const clearChannels = () => ({
  type: CLEAR_CHANNELS
});

const uploadAudioStarted = startInfo => ({
  type: UPLOAD_AUDIO_STARTED,
  payload: startInfo
});

const uploadAudioSuccess = channelInfo => ({
  type: UPLOAD_AUDIO_SUCCESS,
  payload: channelInfo
});

const uploadAudioFailure = errorInfo => ({
  type: UPLOAD_AUDIO_FAILURE,
  payload: errorInfo
});

function loadChannelFromFile(channelSource, audioContext) {
  const loader = LoaderFactory.createLoader(channelSource, audioContext);
  return loader.load();
};

// load a channel based on a channel config
export function loadAChannel(channelConfig, audioContext, state) {
  if (channelConfig.type === "audio") {
    return loadWaveChannel(channelConfig, audioContext);
  }
  return loadImageChannel(channelConfig, state);
}

function loadImageChannel(channelConfig, state) {

  // first normalize the parts
  // an icremented 'curid' is the part id used as key
  const normalizedParts = channelConfig.parts ? channelConfig.parts.reduce((res, part) => {
    part.id = res.curid;
    part.duration = part.duration ? 
      part.duration : getImageDuration(state, part.src);
    res[res.curid] = part;
    res.curid++;
    return res;
  }, {curid: 0}) : null;

  // incremented id no longer required
  delete normalizedParts.curid;
  delete channelConfig.parts;
  channelConfig.lastPartId = Object.keys(normalizedParts).length - 1;
  channelConfig.playState = "stopped";

  return Promise.resolve({
    ...channelConfig,
    byParts: normalizedParts
  })
}

// load wave channel from static content
function loadWaveChannel(channelConfig, audioContext) {
  return loadChannelFromFile(channelConfig.src, audioContext)
    .then((buf) => {
      return {
        type: "audio",
        playState: "stopped",
        sampleRate: buf.sampleRate,
        buffer: buf,
        ...channelConfig
      }
    })
}

export const uploadAudioFile = (audioFile, audioContext) => {
  return (dispatch, getState) => {
    dispatch(uploadAudioStarted());
    console.log("Reading " + audioFile.name + "...");

    return readAudioFile(audioFile, audioContext)
      .then((audioBuffer) => {
        const channelInfo = {
          type: "audio",
          playState: "stopped",
          src: audioFile.name,
          offset: 0,
          sampleRate: audioBuffer.sampleRate,
          buffer: audioBuffer
        }
        dispatch(addChannel(channelInfo)); 
      })
      .then(dispatch(uploadAudioSuccess()))
      .catch(err => {
        console.error(err);
        return dispatch(uploadAudioFailure({
          err
        }))
      })
  }
}

// since we do not get the channel id this only works for the channel that was
// last added
export const updateChannelMarkersForLastAddedChannel = (channelInfo) => {
  return (dispatch, getState) => {
    
    if (channelInfo.byParts){
      const channelId = getLastChannelId(getState());

      Object.keys(channelInfo.byParts).forEach((partId) => {
      
        const part = channelInfo.byParts[partId];
        dispatch(setMarker({
            markerId: `${channelId}-${partId}-l`, 
            pos: part.offset,
            type: "normal"
          }));
          dispatch(setMarker({
            markerId: `${channelId}-${partId}-r`, 
            pos: part.offset + part.duration,
            type: "normal"
          }));
      });
    }
  }
};

export const addPartAndMarkers = (partInfo) => {
  return (dispatch, getState) => {
    dispatch(addPart(partInfo))
    const lastPartId = getLastPartId(getState(), partInfo.channelId);
    dispatch(setMarker({
      markerId: `${partInfo.channelId}-${lastPartId}-l`, 
      pos: partInfo.offset,
      type: "normal"
    }));
    dispatch(setMarker({
      markerId: `${partInfo.channelId}-${lastPartId}-r`, 
      pos: partInfo.offset + partInfo.duration,
      type: "normal"
    }));
    dispatch(deleteMarker({
      markerId: "insert"})); 
      
    // select the new part
    const lastPart = {...partInfo};
    lastPart.partId = lastPartId;
    lastPart.selected = true;
    dispatch(selectPartOrImage(lastPart));
  }
}

export const addPart = partInfo => ({
  type: ADD_PART,
  payload: partInfo
});

export const deleteSelectedPartAndMarkers = () => {
  return (dispatch, getState) => {
    const selPart = getSelectedPart(getState());
    const selImage = getSelectedImage(getState());
    if (selPart) {
      dispatch(deletePart(selPart));
      dispatch(deleteMarker({
        markerId: `${selPart.channelId}-${selPart.partId}-l`}));
      dispatch(deleteMarker({
        markerId: `${selPart.channelId}-${selPart.partId}-r`}));
      dispatch(deselect());
    }
    if (selImage) {
      dispatch(removeImage(selImage));
    }
  }
}


export const deletePart = partInfo => ({
  type: DELETE_PART,
  payload: partInfo
});


// play related actions

export const playChannel = () => ({
  type: PLAY_CHANNELS
});

export const stopChannel = () => ({
  type: STOP_CHANNELS
});

export const setChannelPlayState = (stateInfo) => ({
  type: SET_CHANNEL_PLAY_STATE,
  payload: stateInfo
});

export const moveChannel = (moveInfo) => ({
  type: MOVE_CHANNEL,
  payload: moveInfo
});

