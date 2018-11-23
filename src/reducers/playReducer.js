import {PLAY_AUDIO, STOP_AUDIO, SET_CHANNEL_PLAY_STATE, LOAD_AUDIO_SUCCESS} from '../actions/types';

const initialState = {
  playState: "stopped",
  byIds: {},
};

export default(state = initialState, action) => {
  switch (action.type) {
    /* 
    case LOAD_AUDIO_SUCCESS:
    return {
      ...state,
      // create initial channel playstate
      // TODO: improve this using a sub-reducer
      byIds: {
        ...state.byIds,
        [action.payload.audioSource]: {
          playState: "stopped"
        }
      }
    }*/

    case PLAY_AUDIO:
      return {
        ...state,
        playState: "playing",
         // move all channel playStates to playing
        /* byIds: Object.keys(state.byIds).map((key) => {
          return { [key]: {audioState: "playing" } }})
          .reduce((a,b) => Object.assign({}, a, b)) */
      };
    case STOP_AUDIO:
      return {
        ...state,
        playState: "stopped",
         // move all channel playStates to stopped
        /* byIds: Object.keys(state.byIds).map((key) => {
          return { [key]: { audioState: "stopped" } }})
          .reduce((a,b) => Object.assign({}, a, b)) */
      };
    
    case SET_CHANNEL_PLAY_STATE:
      // aggregated state is playing when at least
      // one channel is playing
      let aggrPlayState = state.playState;
      if (action.payload.playState === "playing") {
      	aggrPlayState = "playing";
      } else if (action.payload.playState === "stopped"
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
  /* if (state.play.byIds.length === 0) {
    return "stopped";
  }
  return Object.keys(state.play.byIds)
		.reduce((result, key) => 
			result && state.play.byIds[key] === "stopped",
			true) ? "stopped" : "playing"; */
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
