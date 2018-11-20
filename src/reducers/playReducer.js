import {PLAY_AUDIO, STOP_AUDIO} from '../actions/types';

const initialState = {
  playState: "stopped"
};

export default(state = initialState, action) => {
  switch (action.type) {
    
    case PLAY_AUDIO:
      return {
        ...state,
        playState: "playing",
        startAt: (action.payload && action.payload.startAt) ? action.payload.startAt : 0
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

export const getPlayState = (state, source) => {
  return state.play && state.play.playState
}

export const getPlayStartAt = (state, source) => {
  return state.play && state.play.startAt
}
