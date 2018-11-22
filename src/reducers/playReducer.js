import {PLAY_AUDIO, STOP_AUDIO, SET_CHANNEL_PLAY_STATE} from '../actions/types';

const initialState = {
  playState: "stopped",
  byIds: {},
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
    
    case SET_CHANNEL_PLAY_STATE:
      return {
        ...state,
        byIds: {
          ...state.byIds,
          [action.payload.channelId] : {
            playState: action.payload.playState
          }
        }
      }

    default:
      return state
  }
}

export const getPlayState = (state) => {
  return state.play.playState;
}

export const getChannelPlayStates = (state) => {
  return state.play.byIds;
}

export const getChannelPlayState = (state, channelId) => {
  return state.play.byIds[channelId] && state.play.byIds[channelId].playState
}

export const getPlayStartAt = (state) => {
  return state.play.startAt;
}
