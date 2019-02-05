import { merge, cloneDeep } from 'lodash';

import { ADD_CHANNEL, CLEAR_CHANNELS, PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE,
  MOVE_CHANNEL, ADD_PART, DELETE_PART, DELETE_CHANNEL, SELECT_CHANNEL, DESELECT_CHANNEL } from '../actions/types';

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
      const lastPartId = action.payload.lastPartId >= 0 ? action.payload.lastPartId : -1;
      /* let duration = action.payload.duration;
      if (!duration && action.payload.type === "audio" && action.payload.buffer) {
        duration = action.payload.buffer.duration;
      }
      if (!duration) {
        duration = 10; 
      } */
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

    case DELETE_CHANNEL:
      const channels = cloneDeep(state.byId);
      delete channels[action.payload];
      return {
        ...state,
        byId: channels
      }

    case SELECT_CHANNEL:
    return {
      ...state,
      byId: {
        ...state.byId,
        [action.payload]: {
          ...state.byId[action.payload],
          selected: true
        }
      }
    };

    case DESELECT_CHANNEL:
    return {
      ...state,
      byId: {
        ...state.byId,
        [action.payload]: {
          ...state.byId[action.payload],
          selected: false
        }
      }
    };

    case ADD_PART:
      const partId = state.byId[action.payload.channelId].lastPartId + 1;
      const maxDuration = Math.max(state.byId[action.payload.channelId].duration,
        action.payload.offset + action.payload.duration);
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.channelId]: {
            ...state.byId[action.payload.channelId],
            lastPartId: partId,
            duration: maxDuration,
            byParts: {
              ...state.byId[action.payload.channelId].byParts,
              [partId]: {
                id: partId,
                src: action.payload.src,
                imageId: action.payload.imageId,
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
      if (_hasAudioChannel(state) && _allChannelsStopped(state)) {
        return {
          ...state,
          byId: _allChannelsStopped(state) && mergePlayStateIntoToChannels(state, "playing")
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

function _hasAudioChannel(channelState) {
  return Object.keys(channelState.byId)
    .reduce((result, key) => result || 
      channelState.byId[key].type === "audio",
      false)
}

function _allChannelsStopped(channelState) {
  return Object.keys(channelState.byId)
    .reduce((result, key) => result && (channelState.byId[key].type !== "audio" || channelState.byId[key].playState === "stopped"),
      true)
}

// state access functions

export function hasAudioChannel(state) {
  return _hasAudioChannel(state.channel);
}

export function allChannelsStopped(state) {
  return (_allChannelsStopped(state.channel));
}

// channel data sorted by type and id
export const getAllChannelsData = (state) => {
  return Object.values(state.channel.byId)
  .sort((ch1, ch2) => {
    const str1 = ch1.type + ch1.id;
    const str2 = ch2.type + ch2.id;
    if (str1 < str2) {
      return -1;
    } else if (str2 > str1) {
      return 1;
    }
    return 0;
  })
}

export const getAllChannelsOverview = (state) => {
  return getAllChannelsData(state)
    .map((channel) => ({
      id: channel.id,
      type: channel.type,
      selected: channel.selected,
    }));
}

export const getChannelData = (state, channelId) => {
  return state.channel.byId[channelId];
}

export const getChannelIds = (state) => {
  return Object.keys(state.channel.byId);
}

export const getPart = (state, channelId, partId) => {
  return state.channel.byId[channelId].byParts[partId];
}

export const getLastChannelId = (state) => {
  return state.channel.lastChannelId;
}

export const getLastChannel = (state) => {
  const lastChannelId = state.channel.lastChannelId;
  return state.channel.byId[lastChannelId];
}

export const getLastPartId = (state, channelId) => {
  return state.channel.byId[channelId].lastPartId;
}

function getDuration(state, channelId) {
  const channelData = state.channel.byId[channelId];
  const offset = channelData.offset ? channelData.offset : 0;
  return channelData.duration + offset;
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
  const allowedProps = ["type", "names", "src", "sampleRate", "offset", "selected", "duration"];
  const propsToArray = {
    "byParts": "parts"
  };
  const channels = state.channel.byId ? Object.values(state.channel.byId) : [];
  return channels.map((ch) => {
    return filterObjectByKeys(ch, allowedProps, propsToArray)
  });
};

export const getSelectedChannelIds = (state, type) => {
    return Object.values(state.channel.byId)
      .filter((channel) => channel.selected && (!type || channel.type === type))
      .map((channel) => channel.id);
}
