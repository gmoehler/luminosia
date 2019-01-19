import { merge, cloneDeep } from 'lodash';

import { ADD_CHANNEL, CLEAR_CHANNELS,
  PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE, MOVE_CHANNEL, ADD_PART, DELETE_PART } from '../actions/types';

import { samplesToSeconds } from '../utils/conversions';
import { filterObjectByKeys } from '../utils/miscUtils';

// TODO: improve this reducer using a sub-reducer on the selected channel

const initialState = {
  byId: {},
  lastChannelId: -1
};

export default (state = initialState, action) => {
  switch (action.type) {

    case CLEAR_CHANNELS:
      return initialState;

    case ADD_CHANNEL:
    const id = state.lastChannelId + 1;
    const lastPartId = action.payload.lastPartId ? action.payload.lastPartId : -1;
      return {
        ...state,
        lastChannelId: id,
        byId: {
          ...state.byId,
          [id]: {
            ...action.payload,
            id,
            lastPartId,
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
      // not really implemented
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

// helper functions for reducer

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

function allChannelsStopped(channelState) {
  return Object.keys(channelState.byId)
    .reduce((result, key) => result && (channelState.byId[key].type !== "audio" || channelState.byId[key].playState === "stopped"),
      true)
}

// state access functions

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

function getDuration(state, channelId) {
  const channelData = state.channel.byId[channelId];
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
      .reduce((duration, channeld) => 
        Math.max(duration, getDuration(state, channeld)), 0);
}

// saving the config will return this channel information
// array of all channels with a given list of keys (e.g. not including audio buffer)
export const getChannelsConfig = (state) => {
  const allowedProps = ["id", "type", "names", "src", "sampleRate", "offset"];
  const propsToArray = {"byParts": "parts"};
  const channels = state.channel.byId ? Object.values(state.channel.byId) : [];
  return channels.map((ch) => {
      return filterObjectByKeys(ch, allowedProps, propsToArray)
    });
};
