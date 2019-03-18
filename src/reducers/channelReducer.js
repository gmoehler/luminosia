import { merge, cloneDeep } from "lodash";

import { ADD_CHANNEL, CLEAR_CHANNELS, PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE, MOVE_CHANNEL, ADD_PART, DELETE_PART, DELETE_CHANNEL, SET_CHANNEL_ACTIVE, UNSET_CHANNEL_ACTIVE } from "../actions/types";

import { filterObjectByKeys } from "../utils/miscUtils";

// TODO: improve this reducer using a sub-reducer on the selected channel

const initialState = {
  byChannelId: {},
  lastChannelId: -1
};

export default (state = initialState, action) => {
  switch (action.type) {

    case CLEAR_CHANNELS:
      return initialState;

    case ADD_CHANNEL:
      const channelId = state.lastChannelId + 1;
      const lastPartId = action.payload.lastPartId && action.payload.lastPartId >= 0 ? action.payload.lastPartId : -1;
      return {
        ...state,
        lastChannelId: channelId,
        byChannelId: {
          ...state.byChannelId,
          [channelId]: {
            ...action.payload,
            channelId,
            lastPartId,
          }
        }
      };

    case DELETE_CHANNEL:
      const channels = cloneDeep(state.byChannelId);
      delete channels[action.payload];
      return {
        ...state,
        byChannelId: channels
      };

    case SET_CHANNEL_ACTIVE:
      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload]: {
            ...state.byChannelId[action.payload],
            active: true
          }
        }
      };

    case UNSET_CHANNEL_ACTIVE:
      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload]: {
            ...state.byChannelId[action.payload],
            active: false
          }
        }
      };

    case ADD_PART:
      const partId = state.byChannelId[action.payload.channelId].lastPartId + 1;
      const maxDuration = Math.max(state.byChannelId[action.payload.channelId].duration,
        action.payload.offset + action.payload.duration);
      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload.channelId]: {
            ...state.byChannelId[action.payload.channelId],
            lastPartId: partId,
            duration: maxDuration,
            byPartId: {
              ...state.byChannelId[action.payload.channelId].byPartId,
              [partId]: {
                partId,
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
      const parts = cloneDeep(state.byChannelId[action.payload.channelId]).byPartId;
      delete parts[action.payload.partId];

      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload.channelId]: {
            ...state.byChannelId[action.payload.channelId],
            byPartId: parts
          }
        }
      };

    case PLAY_CHANNELS:
      if (_allChannelsStopped(state)) {
        return {
          ...state,
          byChannelId: _allChannelsStopped(state) && mergePlayStateIntoToChannels(state, "playing")
        };
      }
      return {
        ...state
      };

    case STOP_CHANNELS:
      return {
        ...state,
        byChannelId: mergePlayStateIntoToChannels(state, "stopped")
      };

    case SET_CHANNEL_PLAY_STATE:
      const mergedChannelState = merge({},
        state.byChannelId[action.payload.channelId],
        {
          playState: action.payload.playState
        }
      );

      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload.channelId]: mergedChannelState
        }
      };

    case MOVE_CHANNEL:
      // not really implemented
      const channel = state.byChannelId[action.payload.channelId];
      const part = channel.byPartId[action.payload.partId];
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
          byPartId: {
            [action.payload.partId]: mergedPart
          }
        }
      );

      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload.channelId]: mergedMoveChannelState
        }
      };

    default:
      return state;
  }
};

// helper functions for reducer

function mergePlayStateIntoToChannels(state, playState) {
  const channelPlayStatesStopped = Object.keys(state.byChannelId)
    .map((key) => {
      return {
        [key]: {
          playState: playState
        }
      };
    })
    .reduce((a, b) => Object.assign({}, a, b));
  const mergedState = merge({}, state.byChannelId, channelPlayStatesStopped);
  return mergedState;
}

function _allChannelsStopped(channelState) {
  return Object.keys(channelState.byChannelId)
    .reduce((result, key) => result && channelState.byChannelId[key].playState === "stopped",
      true);
}

// state access functions

export function allChannelsStopped(state) {
  return (_allChannelsStopped(state.channel));
}

// channel data sorted by type and id
export const getAllChannelsData = (state) => {
  return Object.values(state.channel.byChannelId)
    .sort((ch1, ch2) => {
      const str1 = ch1.type + ch1.channelId;
      const str2 = ch2.type + ch2.channelId;
      if (str1 < str2) {
        return -1;
      } else if (str2 > str1) {
        return 1;
      }
      return 0;
    });
};

export const getAllChannelsOverview = (state) => {
  return getAllChannelsData(state)
    .map((channel) => ({
      channelId: channel.channelId,
      type: channel.type,
      active: channel.active,
    }));
};

export const getChannelData = (state, channelId) => {
  return state.channel.byChannelId[channelId];
};

export const getChannelIds = (state) => {
  return Object.keys(state.channel.byChannelId);
};

export const getPart = (state, channelId, partId) => {
  return state.channel.byChannelId[channelId].byPartId[partId];
};

export const getLastChannelId = (state) => {
  return state.channel.lastChannelId;
};

export const getLastChannel = (state) => {
  const lastChannelId = state.channel.lastChannelId;
  return state.channel.byChannelId[lastChannelId];
};

export const getLastPartId = (state, channelId) => {
  return state.channel.byChannelId[channelId].lastPartId;
};

function getDuration(state, channelId) {
  const channelData = state.channel.byChannelId[channelId];
  const offset = channelData.offset ? channelData.offset : 0;
  return channelData.duration + offset;
}

export const getMaxDuration = (state) => {
  return state.channel.byChannelId === {} ? 0 :
    Object.keys(state.channel.byChannelId)
      .reduce((duration, channeld) => Math.max(duration, getDuration(state, channeld)), 0);
};

// saving the config will return this channel information
// array of all channels with a given list of keys (e.g. not including audio buffer)
export const getChannelsConfig = (state) => {
  const allowedProps = ["type", "names", "src", "sampleRate", "offset", "selected", "duration"];
  const propsToArray = {
    "byPartId": "parts"
  };
  const channels = state.channel.byChannelId ? Object.values(state.channel.byChannelId) : [];
  return channels.map((ch) => {
    return filterObjectByKeys(ch, allowedProps, propsToArray);
  });
};

export const getActiveChannelIds = (state, type) => {
  return Object.values(state.channel.byChannelId)
    .filter((channel) => channel.active && (!type || channel.type === type))
    .map((channel) => channel.channelId);
};
