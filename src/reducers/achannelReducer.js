// reducer working on the part entities

import { combineReducers } from "redux";

import {
  ADD_A_CHANNEL, DELETE_A_CHANNEL, CLEAR_ALL_CHANNELS,
  SET_A_CHANNEL_INACTIVE, PLAY_THE_CHANNELS, STOP_ALL_CHANNELS,
  STOP_A_CHANNEL, SET_A_CHANNEL_ACTIVE,
} from "../actions/types";
import { denormalize } from "normalizr";
import { channelSchema2 } from "./channelReducer";


export const initialState = {
  byChannelId: {},
  allChannelIds: [],
  activeChannels: [],
  playingChannels: [],
};

// split into 2 reducers: byChannelId and allChannelIds

const byChannelId = (state = {}, action) => {
  switch (action.type) {

    case ADD_A_CHANNEL: {
      return {
        ...state,
        ...action.payload.entities.byChannelId, // normalized channels
      };
    }

    case DELETE_A_CHANNEL:
      const newState = { ...state };
      delete newState[action.payload];
      return newState;

    case CLEAR_ALL_CHANNELS:
      return {};

    default:
      return state;
  }
};

const allChannelIds = (state = [], action) => {
  switch (action.type) {

    case ADD_A_CHANNEL:
      return [...state, action.payload.result];

    case DELETE_A_CHANNEL:
      return state.filter(p => p !== action.payload);

    case CLEAR_ALL_CHANNELS:
      return [];

    default:
      return state;
  }
};

const activeChannels = (state = [], action) => {
  switch (action.type) {

    case SET_A_CHANNEL_ACTIVE:
      return [...state, action.payload];

    case DELETE_A_CHANNEL:
    case SET_A_CHANNEL_INACTIVE:
      return state.filter(p => p !== action.payload);

    case CLEAR_ALL_CHANNELS:
      return [];

    default:
      return state;
  }
};

const playingChannels = (state = [], action) => {
  switch (action.type) {

    case PLAY_THE_CHANNELS:
      return [...state, ...action.payload];

    case DELETE_A_CHANNEL:
    case STOP_A_CHANNEL:
      return state.filter(p => p !== action.payload);

    case CLEAR_ALL_CHANNELS:
    case STOP_ALL_CHANNELS:
      return [];

    default:
      return state;
  }
};

export default combineReducers({
  byChannelId,
  allChannelIds,
  activeChannels,
  playingChannels
});

export function channelExists(state, channelId) {
  return state.entities.channels.allChannelIds.includes(channelId);
}

export function getNumChannels(state) {
  return state.entities.channels.allChannelIds.length;
}

export function getActiveChannels(state) {
  return state.entities.channels.activeChannels;
}

function _getChannelDuration(state, channelId) {
  const ch = _getChannel(state, channelId);
  return ch ? ch.offset + ch.duration : 0;
}

function _getChannel(state, channelId) {
  if (!channelExists(state, channelId)) {
    return null;
  }
  return state.entities.channels.byChannelId[channelId];
}

export const getMaxChannelDuration = state => (getNumChannels(state) === 0 ? 0
  : state.entities.channels.allChannelIds
    .reduce((duration, channeld) => Math.max(duration, _getChannelDuration(state, channeld)), 0));

export const getDenormalizedChannel = (state, channelId) => {
  const channel = _getChannel(state, channelId);
  return channel ? denormalize(channel, channelSchema2, state.entities.parts) : null;
};