import {LOAD_AUDIO_STARTED, LOAD_AUDIO_SUCCESS, LOAD_AUDIO_FAILURE, PLAY_AUDIO_STARTED, PLAY_AUDIO_STOPPED} from '../actions/types';

const initialState = {
  loading: false,
  audioBuffer: null,
  peaks: null,
  error: null,
  playing: false
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
        audioBuffer: action.payload.audioBuffer.audioBuffer,
        peaks: action.payload.audioBuffer.peaks
      };
    case LOAD_AUDIO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    case PLAY_AUDIO_STARTED:
      return {
        ...state,
        playing: true
      };
    case PLAY_AUDIO_STOPPED:
      return {
        ...state,
        playing: false
      };

    default:
      return state
  }
}
