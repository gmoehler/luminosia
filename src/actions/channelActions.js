import LoaderFactory from '../loader/LoaderFactory'
import { merge } from 'lodash';

import { LOAD_CHANNEL_STARTED, LOAD_CHANNEL_FAILURE, LOAD_CHANNEL_SUCCESS, 
  LOAD_MULTICHANNEL_STARTED, LOAD_MULTICHANNEL_FAILURE, LOAD_MULTICHANNEL_SUCCESS, 
  PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE, MOVE_CHANNEL, 
  ADD_PART, DELETE_PART, ADD_CHANNEL, CLEAR_CHANNELS
} from './types';

import { setMarker, deleteMarker, deselect, selectPart } from './viewActions';
import { samplesToSeconds } from '../utils/conversions';
import { getLastPartId } from '../reducers/channelReducer';
import { getSelectedPart } from '../reducers/viewReducer';
import { getImageDuration } from '../reducers/imageListReducer';

// load channel from config

export const addChannel = channelInfo => ({
  type: ADD_CHANNEL,
  payload: channelInfo
});

export const clearChannels = () => ({
  type: CLEAR_CHANNELS
});

// load channels from files

const loadChannelStarted = startInfo => ({
  type: LOAD_CHANNEL_STARTED,
  payload: startInfo
});

const loadChannelSuccess = channelInfo => ({
  type: LOAD_CHANNEL_SUCCESS,
  payload: channelInfo
});

const loadChannelFailure = errorInfo => ({
  type: LOAD_CHANNEL_FAILURE,
  payload: errorInfo
});

const loadMultiChannelStarted = startInfo => ({
  type: LOAD_MULTICHANNEL_STARTED,
  payload: startInfo
});

const loadMultiChannelSuccess = channelInfo => ({
  type: LOAD_MULTICHANNEL_SUCCESS,
  payload: channelInfo
});

const loadMultiChannelFailure = errorInfo => ({
  type: LOAD_MULTICHANNEL_FAILURE,
  payload: errorInfo
});

function loadChannelFromFile(channelSource, audioContext) {
  const loader = LoaderFactory.createLoader(channelSource, audioContext);
  return loader.load();
};

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
    part.duration = getImageDuration(state, part.src);
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

export const updateChannelMarkers = (channelInfo) => {
  return (dispatch, getState) => {
    
    Object.keys(channelInfo.byParts).forEach((partId) => {
    
      const part = channelInfo.byParts[partId];
      dispatch(setMarker({
          markerId: `${channelInfo.id}-${partId}-l`, 
          pos: part.offset,
          type: "normal"
        }));
        dispatch(setMarker({
          markerId: `${channelInfo.id}-${partId}-r`, 
          pos: part.offset + part.duration,
          type: "normal"
        }));
    });
  }
}

function doLoadMultiPart(dispatch, getState, channelConfig, audioContext) {
  dispatch(loadMultiChannelStarted({
    channelId: channelConfig.id
  }));

  const loadChannelPromises = channelConfig.parts
    .map((fileConfig) => loadChannelFromFile(fileConfig.src, audioContext));


  Promise.all(loadChannelPromises)
    .then((channelBuffers) => {

      // organize result object read from file
      const normalizedBuffers = channelBuffers.reduce((res, buf) => {

        // buffer is only needed for duration because we load image again for canvas
        res[res.numParts] = {
          duration: samplesToSeconds(buf.width, channelConfig.sampleRate)
        };
        res.numParts++;
        return res;
      }, {numParts: 0})

	    // an icrementing integer is the part id used as key
      const normalizedParts = channelConfig.parts.reduce((res, part) => {
        part.id = res.numParts;
        res[res.numParts] = part;
        res.numParts++;
        return res;
      }, {numParts: 0})

      const reducedConfig = Object.assign({}, channelConfig);
      reducedConfig.lastPartId =  normalizedParts.numParts-1;
      delete reducedConfig.parts; // will be normalized with channelParts

      const channelParts = merge({}, normalizedBuffers, normalizedParts);
      delete channelParts.numParts; // delete intermediate value

      dispatch(loadMultiChannelSuccess({
        channelConfig: reducedConfig,
        channelParts
      }
      ))
      Object.values(channelParts).forEach((part) => {
        dispatch(setMarker({
          markerId: `${channelConfig.id}-${part.id}-l`, 
          pos: part.offset,
          type: "normal"
        }))
        dispatch(setMarker({
          markerId: `${channelConfig.id}-${part.id}-r`, 
          pos: part.offset + part.duration,
          type: "normal"
        }))
      })
    })
    .catch(err => {
      dispatch(loadMultiChannelFailure({
        channelId: channelConfig.id,
        err
      }));
    });
}

function doLoad(dispatch, getState, channelConfig, audioContext) {
  dispatch(loadChannelStarted({
    channelSource: channelConfig.src
  }));

  loadChannelFromFile(channelConfig.src, audioContext)
    .then(channelBuffer => {
      dispatch(loadChannelSuccess({
        channelConfig,
        channelBuffer,
      }));
    })
    .catch(err => {
      dispatch(loadChannelFailure({
        channelSource: channelConfig.src,
        err
      }));
    });
}

export const loadChannel = (({channels, audioContext}) => {
  return (dispatch, getState) => {
    channels.map((channelConfig) => {
      if (channelConfig.parts) {
        return doLoadMultiPart(dispatch, getState, channelConfig, audioContext);
      }
      return doLoad(dispatch, getState, channelConfig, audioContext);
    })
  }
});

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
    dispatch(selectPart(lastPart));
  }
}

export const addPart = partInfo => ({
  type: ADD_PART,
  payload: partInfo
});

export const deleteSelectedPartAndMarkers = () => {
  return (dispatch, getState) => {
    const selPart = getSelectedPart(getState());
    if (selPart) {
      dispatch(deletePart(selPart));
      dispatch(deleteMarker({
        markerId: `${selPart.channelId}-${selPart.partId}-l`}));
      dispatch(deleteMarker({
        markerId: `${selPart.channelId}-${selPart.partId}-r`}));
      dispatch(deselect());
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

