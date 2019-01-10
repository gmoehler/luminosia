import LoaderFactory from '../loader/LoaderFactory'
import { merge } from 'lodash';

import { LOAD_CHANNEL_STARTED, LOAD_CHANNEL_FAILURE, LOAD_CHANNEL_SUCCESS, 
  LOAD_MULTICHANNEL_STARTED, LOAD_MULTICHANNEL_FAILURE, LOAD_MULTICHANNEL_SUCCESS, 
  PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE, MOVE_CHANNEL, 
  ADD_PART, DELETE_PART,
} from './types';

import { setMarker, deleteMarker } from './viewActions';
import { samplesToSeconds } from '../utils/conversions';
import { getLastPartId, getPart } from '../reducers/channelReducer';

// load channel async action

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
}
;

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
          pos: part.offset}))
        dispatch(setMarker({
          markerId: `${channelConfig.id}-${part.id}-r`, 
          pos: part.offset + part.duration}))
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
      pos: partInfo.offset}));
    dispatch(setMarker({
      markerId: `${partInfo.channelId}-${lastPartId}-r`, 
      pos: partInfo.offset + partInfo.duration}));
    dispatch(deleteMarker({
      markerId: "insert"})); 
  }
}

export const addPart = partInfo => ({
  type: ADD_PART,
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

