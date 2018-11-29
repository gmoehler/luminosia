import LoaderFactory from '../loader/LoaderFactory'

import { LOAD_CHANNEL_STARTED, LOAD_CHANNEL_FAILURE, LOAD_CHANNEL_SUCCESS, PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE,
} from './types';

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

function loadChannelFromFile(channelSource, audioContext) {
  const loader = LoaderFactory.createLoader(channelSource, audioContext);
  return loader.load();
}
;

function doLoad(dispatch, getState, channelSource, audioContext) {
  dispatch(loadChannelStarted({
    channelSource
  }));

  loadChannelFromFile(channelSource, audioContext)
    .then(channelBuffer => {
      dispatch(loadChannelSuccess({
        channelSource,
        channelBuffer,
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
  return (dispatch, getState) => {
    channelSources.map((channelSource) => doLoad(dispatch, getState, channelSource, audioContext))
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