import { merge } from 'lodash';

import { LOAD_CHANNEL_STARTED, LOAD_CHANNEL_SUCCESS, LOAD_CHANNEL_FAILURE, PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE } from '../actions/types';

const initialState = {
  byIds: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CHANNEL_STARTED:
      return {
        ...state,
        byIds: {
          [action.payload.channelSource]: {
            loading: true
          }
        }
      };
    case LOAD_CHANNEL_SUCCESS:
      return {
        ...state,
        // TODO: improve this using a sub-reducer
        byIds: {
          ...state.byIds,
          [action.payload.channelSource]: {
            loading: false,
            type: action.payload.channelSource.endsWith(".png") ? "image" : "audio",
            playState: "stopped",
            error: null,
            buffer: action.payload.channelBuffer,
            peaks: action.payload.peaks,
            source: action.payload.channelSource
          }
        }
      }
    case LOAD_CHANNEL_FAILURE:
      return {
        ...state,
        byIds: {
          [action.payload.channelSource]: {
            loading: false,
            playState: "stopped",
            error: action.payload
          }
        }
      };

    case PLAY_CHANNELS:
      if (allChannelsStopped(state)) {
        return {
          ...state,
          byIds: allChannelsStopped(state) && mergePlayStateIntoToChannels(state, "playing")
        }
      }
      return {
        ...state
      }

    case STOP_CHANNELS:
      return {
        ...state,
        byIds: mergePlayStateIntoToChannels(state, "stopped")
      }

    case SET_CHANNEL_PLAY_STATE:

      const mergedChannelState = merge({},
        state.byIds[action.payload.channelId],
        {
          playState: action.payload.playState
        }
      );

      return {
        ...state,
        byIds: {
          ...state.byIds,
          [action.payload.channelId]: mergedChannelState
        }
      }

    default:
      return state
  }
}

function mergePlayStateIntoToChannels(state, playState) {
  const channelPlayStatesStopped = Object.keys(state.byIds)
    .map((key) => {
      return {
        [key]: {
          playState: playState
        }
      }
    })
    .reduce((a, b) => Object.assign({}, a, b));
  const mergedState = merge({}, state.byIds, channelPlayStatesStopped);
  return mergedState;
}

export const getallChannelsData = (state) => {
  return state.channel.byIds;
}

export const getChannelData = (state, source) => {
  return state.channel.byIds[source];
}

function allChannelsStopped(playState) {
  return Object.keys(playState.byIds)
    .reduce((result, key) => result && (playState.byIds[key].playState === "stopped"),
      true)
}
