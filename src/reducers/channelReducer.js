import { merge, cloneDeep } from 'lodash';

import { LOAD_CHANNEL_STARTED, LOAD_CHANNEL_SUCCESS, LOAD_CHANNEL_FAILURE, LOAD_MULTICHANNEL_STARTED, LOAD_MULTICHANNEL_FAILURE, LOAD_MULTICHANNEL_SUCCESS, PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE, MOVE_CHANNEL, ADD_PART, DELETE_PART } from '../actions/types';

import { samplesToSeconds } from '../utils/conversions';

// TODO: improve this using a sub-reducer on the selected channel
const initialState = {
  byId: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CHANNEL_STARTED:
      return {
        ...state,
        byId: {
          [action.payload.channelSource]: {
            loading: true
          }
        }
      };

    case LOAD_CHANNEL_SUCCESS:
      const channelSource = action.payload.channelConfig.src;
      return {
        ...state,
        byId: {
          ...state.byId,
          [channelSource]: {
            loading: false,
            type: channelSource.endsWith(".png") ? "image" : "audio",
            playState: "stopped",
            sampleRate: action.payload.channelBuffer.sampleRate,
            error: null,
            buffer: action.payload.channelBuffer,
            ...action.payload.channelConfig
          }
        }
      };

    case LOAD_CHANNEL_FAILURE:
      return {
        ...state,
        byId: {
          [action.payload.channelSource]: {
            loading: false,
            playState: "stopped",
            error: action.payload
          }
        }
      };

    case LOAD_MULTICHANNEL_STARTED:
      return {
        ...state,
        byId: {
          [action.payload.channelId]: {
            loading: true
          }
        }
      };

    case LOAD_MULTICHANNEL_SUCCESS:
      const channelId = action.payload.channelConfig.id;
      return {
        ...state,
        byId: {
          ...state.byId,
          [channelId]: {
            loading: false,
            type: "image",
            playState: "stopped",
            error: null,
            ...action.payload.channelConfig,
            byParts: {
              ...action.payload.channelParts,
            }
          }
        }
      }

    case LOAD_MULTICHANNEL_FAILURE:
      return {
        ...state,
        byId: {
          [action.payload.channelId]: {
            loading: false,
            playState: "stopped",
            error: action.payload
          }
        }
      };

    case ADD_PART:
      const partId = state.byId[action.payload.channelId].lastPartId + 1;
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.channelId]: {
            ...state.byId[action.payload.channelId],
            lastPartId: partId,
            byParts: {
              ...state.byId[action.payload.channelId].byParts,
              [partId]: {
                id: partId,
                src: action.payload.src,
                offset: action.payload.offset,
                duration: action.payload.duration, 
              }
            }
          }
        }
      };

    case DELETE_PART:
      const parts = cloneDeep(state.byId[action.payload.channelId]).byParts;
      delete parts[action.payload.partId];

      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.channelId]: {
            ...state.byId[action.payload.channelId],
            byParts: parts
          }
        }
      };

    case PLAY_CHANNELS:
      if (allChannelsStopped(state)) {
        return {
          ...state,
          byId: allChannelsStopped(state) && mergePlayStateIntoToChannels(state, "playing")
        }
      }
      return {
        ...state
      }

    case STOP_CHANNELS:
      return {
        ...state,
        byId: mergePlayStateIntoToChannels(state, "stopped")
      }

    case SET_CHANNEL_PLAY_STATE:

      const mergedChannelState = merge({},
        state.byId[action.payload.channelId],
        {
          playState: action.payload.playState
        }
      );

      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.channelId]: mergedChannelState
        }
      }

    case MOVE_CHANNEL:
      const channel = state.byId[action.payload.channelId];
      const part = channel.byParts[action.payload.partId];
      const currentOffset = part.offset;
      const offsetIncr = action.payload.incr;
      const updatedOffset = currentOffset ? currentOffset + offsetIncr : offsetIncr;
      const mergedPart = {
        ...part,
        offset: Math.max(0, updatedOffset),
      };
      const mergedMoveChannelState = merge({},
        channel,
        {
          byParts: {
            [action.payload.partId]: mergedPart
          }
        }
      );

      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.channelId]: mergedMoveChannelState
        }
      }

    default:
      return state
  }
}

function mergePlayStateIntoToChannels(state, playState) {
  const channelPlayStatesStopped = Object.keys(state.byId)
    .map((key) => {
      return {
        [key]: {
          playState: playState
        }
      }
    })
    .reduce((a, b) => Object.assign({}, a, b));
  const mergedState = merge({}, state.byId, channelPlayStatesStopped);
  return mergedState;
}

export const getallChannelsData = (state) => {
  return state.channel.byId;
}

export const getChannelData = (state, channelId) => {
  return state.channel.byId[channelId];
}

export const getPart = (state, channelId, partId) => {
  return state.channel.byId[channelId].byParts[partId];
}

export const getLastPartId = (state, channelId) => {
  return state.channel.byId[channelId].lastPartId;
}

function allChannelsStopped(playState) {
  return Object.keys(playState.byId)
    .reduce((result, key) => result && (playState.byId[key].playState === "stopped"),
      true)
}

function getDuration(state, id) {
  const channelData = state.channel.byId[id];
  const offset = channelData.offset ? channelData.offset : 0;
  if (channelData.type === "audio") {
    return channelData.buffer.duration
      + offset;
  }
  return channelData.buffer && channelData.buffer.width ?
    samplesToSeconds(channelData.buffer.width, channelData.sampleRate) + offset
    : 0;
}

export const getMaxDuration = (state) => {
  return state.channel.byId === {} ? 0 :
    Object.keys(state.channel.byId)
      .reduce((result, key) => Math.max(result, getDuration(state, key)), 0);
}