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
      // aggregated state is playing when at least
      // one channel is playing
      let aggrPlayState = state.playState;
      if (action.payload.playState == "playing") {
      	aggrPlayState = "playing";
      } else if (action.payload.playState == "stopped"
			&& allChannelsStopped(state)) {
			aggrPlayState = "stopped";
		}
      return {
        ...state,
        playState: aggrPlayState,
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

function allChannelsStopped(playState) {
	return Object.keys(playState.byIds)
		.reduce((result, key) => 
			result && playState.byIds[key] === "stopped",
			true)
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
