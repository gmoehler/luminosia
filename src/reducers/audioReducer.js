import {LOAD_AUDIO_STARTED, LOAD_AUDIO_SUCCESS, LOAD_AUDIO_FAILURE} from '../actions/types';

const initialState = {
  byIds: {}
};

export default(state = initialState, action) => {
  switch (action.type) {
    case LOAD_AUDIO_STARTED:
      return {
        ...state,
        byIds: {
          [action.payload.audioSource]: {
            loading: true
          }
        }
      };
    case LOAD_AUDIO_SUCCESS:
      return {
        ...state,
        // TODO: improve this using a sub-reducer
        byIds: {
          ...state.byIds,
          [action.payload.audioSource]: {
            loading: false,
            error: null,
            buffer: action.payload.audioBuffer,
            peaks: action.payload.peaks,
            source: action.payload.audioSource
          }
        }
      }
      case LOAD_AUDIO_FAILURE:
      return {
        ...state,
        byIds: {
          [action.payload.audioSource]: {
            loading: false,
            error: action.payload
          }
        }
      };

    default:
      return state
  }
}

export const getAllChannelData = (state) => {
  return state.audio && state.audio.byIds;
}


export const getChannelData = (state, source) => {
  return state.audio && state.audio.byIds && state.audio.byIds[source];
}
