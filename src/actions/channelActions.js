import extractPeaks from 'webaudio-peaks';
import LoaderFactory from '../loader/LoaderFactory'

import { LOAD_CHANNEL_STARTED, LOAD_CHANNEL_FAILURE, LOAD_CHANNEL_SUCCESS, PLAY_AUDIO, STOP_AUDIO, SET_CHANNEL_PLAY_STATE,
} from './types';

// load audio async action

const loadChannelStarted = startInfo => ({
  type: LOAD_CHANNEL_STARTED,
  payload: startInfo
});


const loadChannelSuccess = audioInfo => ({
  type: LOAD_CHANNEL_SUCCESS,
  payload: audioInfo
});

const loadChannelFailure = errorInfo => ({
  type: LOAD_CHANNEL_FAILURE,
  payload: errorInfo
});

function loadChannelFromFile(audioSource, audioContext) {
  const loader = LoaderFactory.createLoader(audioSource, audioContext);
  return loader.load();
}
;

function doLoad(dispatch, audioSource, audioContext) {
  dispatch(loadChannelStarted({
    audioSource
  }));

  loadChannelFromFile(audioSource, audioContext)
    .then(audioBuffer => {
      const peaks = audioSource.endsWith(".png") ? null :
        extractPeaks(audioBuffer, 1000, true, 0, audioBuffer.length, 16);
      dispatch(loadChannelSuccess({
        audioSource,
        audioBuffer,
        peaks
      }));
    })
    .catch(err => {
      dispatch(loadChannelFailure({
        audioSource,
        err
      }));
    });
}

export const loadChannel = (({audioSources, audioContext}) => {
  return dispatch => {
    audioSources.map((audioSource) => doLoad(dispatch, audioSource, audioContext))
  }
});

export const playChannel = () => ({
  type: PLAY_AUDIO
});

export const stopChannel = () => ({
  type: STOP_AUDIO
});

export const setChannelPlayState = (stateInfo) => ({
  type: SET_CHANNEL_PLAY_STATE,
  payload: stateInfo
});