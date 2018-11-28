import extractPeaks from 'webaudio-peaks';
import LoaderFactory from '../loader/LoaderFactory'

import { LOAD_CHANNEL_STARTED, LOAD_CHANNEL_FAILURE, LOAD_CHANNEL_SUCCESS, PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE,
} from './types';

// load audio async action

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

function loadChannelFromFile(channelSource, audioContext) {
  const loader = LoaderFactory.createLoader(channelSource, audioContext);
  return loader.load();
}
;

function doLoad(dispatch, channelSource, audioContext) {
  dispatch(loadChannelStarted({
    channelSource
  }));

  loadChannelFromFile(channelSource, audioContext)
    .then(channelBuffer => {
      const peaks = channelSource.endsWith(".png") ? null :
        extractPeaks(channelBuffer, 1000, true, 0, channelBuffer.length, 16);
      dispatch(loadChannelSuccess({
        channelSource,
        channelBuffer,
        peaks
      }));
    })
    .catch(err => {
      dispatch(loadChannelFailure({
        channelSource,
        err
      }));
    });
}

export const loadChannel = (({channelSources, audioContext}) => {
  return dispatch => {
    channelSources.map((channelSource) => doLoad(dispatch, channelSource, audioContext))
  }
});

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