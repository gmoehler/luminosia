// reducer working on the part entities

import { combineReducers } from "redux";
import { denormalize } from "normalizr";

import {
  CLEAR_CHANNELS, ADD_A_CHANNEL, DELETE_A_CHANNEL, CLEAR_ALL_CHANNELS,
} from "../actions/types";
import { /* getPartIdsInChannel */ } from "./channelReducer";

import { partSchema, } from "./partReducer";

const channelSchema = {
  parts: [partSchema]
};
const channelsSchema = [{
  parts: [partSchema]
}];

export const initialState = {
  byChannelId: {},
  allChannelIds: [],
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
      delete newState[action.payload.channelId]; // ids
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
      return state.filter(p => p !== action.payload.channelId);

    case CLEAR_ALL_CHANNELS:
      return [];

    default:
      return state;
  }
};

export default combineReducers({
  byChannelId,
  allChannelIds,
});

export function channelExists(state, channelId) {
  return state.entities.channels.allChannelIds.includes(channelId);
}

export function getNumChannels(state) {
  return state.entities.channels.allChannelIds.length;
}

function _getChannelDuration(state, channelId) {
  if (!channelExists(state, channelId)) {
    return 0;
  }
  const ch = state.entities.channels.byChannelId[channelId];
  return ch.offset + ch.duration;
}

export const getMaxChannelDuration = state => (getNumChannels(state) === 0 ? 0
  : state.entities.channels.allChannelIds
    .reduce((duration, channeld) => Math.max(duration, _getChannelDuration(state, channeld)), 0));