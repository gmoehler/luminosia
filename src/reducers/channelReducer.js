import { merge, cloneDeep } from "lodash";

import {
  ADD_CHANNEL, CLEAR_CHANNELS, PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE, ADD_A_PART, DELETE_A_PART, DELETE_CHANNEL, SET_CHANNEL_ACTIVE, UNSET_CHANNEL_ACTIVE, UPDATE_CHANNEL,
} from "../actions/types";

import { filterObjectByKeys } from "../utils/miscUtils";
import { denormalize } from "normalizr";
import { partSchema, } from "./partReducer";

export const channelSchema = {
  parts: [partSchema]
};
export const channelsSchema = [{
  parts: [partSchema]
}];

// TODO: improve this reducer using a sub-reducer on the selected channel

const initialState = {
  byChannelId: {},
  lastChannelId: -1,
};

export default (state = initialState, action) => {
  return state;
  switch (action.type) {

    case CLEAR_CHANNELS:
      return initialState;

    case ADD_CHANNEL:
      const channelId = state.lastChannelId + 1;
      // TODO: check array in action already
      const newParts = Array.isArray(action.payload.parts) ?
        [...action.payload.parts] : [];

      return {
        ...state,
        lastChannelId: channelId,
        byChannelId: {
          ...state.byChannelId,
          [channelId]: {
            ...action.payload,
            channelId,
            parts: newParts,
          },
        },
      };

    case DELETE_CHANNEL:
      const channels = cloneDeep(state.byChannelId);
      delete channels[action.payload];
      return {
        ...state,
        byChannelId: channels,
      };

    case SET_CHANNEL_ACTIVE:
      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload]: {
            ...state.byChannelId[action.payload],
            active: true,
          },
        },
      };

    case UPDATE_CHANNEL:
      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload.channelId]: {
            ...state.byChannelId[action.payload.channelId],
            ...action.payload,
          },
        },
      };

    case UNSET_CHANNEL_ACTIVE:
      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload]: {
            ...state.byChannelId[action.payload],
            active: false,
          },
        },
      };

    case ADD_A_PART:
      // add part to parts array
      const part0 = action.payload.entities.byPartId[action.payload.result];
      const channelCopy0 = {
        ...state.byChannelId[part0.channelId]
      };
      const newParts0 = [
        ...channelCopy0.parts,
        action.payload.result, // add new partId
      ];
      // and adjust duration

      const duration0 = Math.max(
        state.byChannelId[part0.channelId].duration,
        part0.offset + part0.duration);

      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [part0.channelId]: {
            ...channelCopy0,
            parts: newParts0,
            duration: duration0,
          }
        }
      };

    case DELETE_A_PART:
      // remove part from parts array
      const channelCopy1 = {
        ...state.byChannelId[action.payload.channelId]
      };
      const newParts1 = [
        ...channelCopy1.parts.filter(id => id !== action.payload.partId)
      ];

      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload.channelId]: {
            ...channelCopy1,
            parts: newParts1,
          }
        }
      };

    case PLAY_CHANNELS:
      if (_allChannelsStopped(state)) {
        return {
          ...state,
          byChannelId: _allChannelsStopped(state) && mergePlayStateIntoToChannels(state, "playing"),
        };
      }
      return {
        ...state,
      };

    case STOP_CHANNELS:
      return {
        ...state,
        byChannelId: mergePlayStateIntoToChannels(state, "stopped"),
      };

    case SET_CHANNEL_PLAY_STATE:
      const mergedChannelState = merge({},
        state.byChannelId[action.payload.channelId],
        {
          playState: action.payload.playState,
        },
      );

      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload.channelId]: mergedChannelState,
        },
      };

    default:
      return state;
  }
};

// helper functions for reducer

function mergePlayStateIntoToChannels(state, playState) {
  const channelPlayStatesStopped = Object.keys(state.byChannelId)
    .map(key => ({
      [key]: {
        playState,
      },
    }))
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

export const denormalizeChannel = (state, channel) =>
  denormalize(channel, channelSchema, state.entities.parts);

export const denormalizeChannels = (state, channels) =>
  denormalize(channels, channelsSchema, state.entities.parts);

// channel data sorted by type and id and denormalized
export const getChannelDenorm = (state, channelId) => {
  const channel = state.channel.byChannelId[channelId];
  return denormalizeChannel(state, channel);
};

export const getAllChannelsDenorm = state => {
  const channels = Object.values(state.channel.byChannelId)
    .sort((ch1, ch2) => {
      const str1 = ch1.type + ch1.channelId;
      const str2 = ch2.type + ch2.channelId;
      return str1.localeCompare(str2);
    });
  return denormalizeChannels(state, channels);
};

export const getAllChannelsOverview = state => getAllChannelsDenorm(state)
  .map(channel => ({
    channelId: channel.channelId,
    type: channel.type,
    active: channel.active,
    gain: channel.gain,
  }));

export const getChannel = (state, channelId) => state.channel.byChannelId[channelId];

export const getChannelIds = state => Object.keys(state.channel.byChannelId);

function getDuration(state, channelId) {
  const channelData = state.channel.byChannelId[channelId];
  const offset = channelData.offset ? channelData.offset : 0;
  return channelData.duration + offset;
}

export const getMaxDuration = state => (state.channel.byChannelId === {} ? 0
  : Object.keys(state.channel.byChannelId)
    .reduce((duration, channeld) => Math.max(duration, getDuration(state, channeld)), 0));

// saving the config will return this channel information
// array of all channels with a given list of keys (e.g. not including audio buffer)
export const getChannelsConfig = (state) => {
  const allowedProps = ["type", "names", "src", "sampleRate", "offset", "selected", "duration", "active", "gain"];
  const propsToArray = {
    byPartId: "parts",
  };
  const channels = state.channel.byChannelId ? Object.values(state.channel.byChannelId) : [];
  return channels.map(ch => filterObjectByKeys(ch, allowedProps, propsToArray));
};

export const getPartIdsInChannel = (state, channelId) => {
  return state.channel.byChannelId[channelId].parts;
};

export const getActiveChannelIds = (state, type) => Object.values(state.channel.byChannelId)
  .filter(channel => channel.active && (!type || channel.type === type))
  .map(channel => channel.channelId);


