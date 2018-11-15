import {LOAD_AUDIO_STARTED, LOAD_AUDIO_SUCCESS, LOAD_AUDIO_FAILURE, PLAY_AUDIO, STOP_AUDIO} from '../actions/types';

const initialState = {
  loading: false,
  audioBuffer: null,
  peaks: null,
  error: null,
  playState: "stopped"
};

export default(state = initialState, action) => {
  switch (action.type) {
    case LOAD_AUDIO_STARTED:
      return {
        ...state,
        loading: true
      };
    case LOAD_AUDIO_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        buffer: action.payload.audioInfo.audioBuffer,
        peaks: action.payload.audioInfo.peaks,
        source: action.payload.audioInfo.audioSource
      };
    case LOAD_AUDIO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    case PLAY_AUDIO:
      return {
        ...state,
        playState: "playing"
      };

    case STOP_AUDIO:
      return {
        ...state,
        playState: "stopped"
      };

    default:
      return state
  }
}
