import LoaderFactory from '../loader/LoaderFactory'
import { merge } from 'lodash';

import { LOAD_CHANNEL_STARTED, LOAD_CHANNEL_FAILURE, LOAD_CHANNEL_SUCCESS, LOAD_MULTICHANNEL_STARTED, LOAD_MULTICHANNEL_FAILURE, LOAD_MULTICHANNEL_SUCCESS, PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE, MOVE_CHANNEL,
} from './types';

import { updateMarker } from './viewActions';
import { samplesToSeconds } from '../utils/conversions';

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

      // organize result object
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

      const channelParts = merge({}, normalizedBuffers, normalizedParts);
      delete channelParts.numParts; // delete intermediate value

      const reducedConfig = Object.assign({}, channelConfig);
      delete reducedConfig.parts; // will be normalized with channelParts

      dispatch(loadMultiChannelSuccess({
        channelConfig: reducedConfig,
        channelParts
      }
      ))
      Object.values(channelParts).forEach((part) => {
        dispatch(updateMarker({
          markerId: `${channelConfig.id}-${part.id}-l`, 
          pos: part.offset}))
        dispatch(updateMarker({
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

export const loadChannel = (({channelConfigs, channelSources, audioContext}) => {
  return (dispatch, getState) => {
    channelConfigs.map((channelConfig) => {
      if (channelConfig.parts) {
        return doLoadMultiPart(dispatch, getState, channelConfig, audioContext);
      }
      return doLoad(dispatch, getState, channelConfig, audioContext);
    })
  }
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

