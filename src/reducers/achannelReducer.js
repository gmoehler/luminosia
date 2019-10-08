// reducer working on the part entities

import { combineReducers } from "redux";
import { denormalize, schema } from "normalizr";

import {
  ADD_A_CHANNEL, DELETE_A_CHANNEL, CLEAR_ALL_CHANNELS,
  SET_A_CHANNEL_INACTIVE, PLAY_THE_CHANNELS, STOP_ALL_CHANNELS,
  STOP_A_CHANNEL, SET_A_CHANNEL_ACTIVE, ADD_A_PART,
} from "../actions/types";
import { partSchema, } from "./partReducer";

// schemata for normalization

export const achannelSchema = new schema.Entity(
  "byChannelId",
  { parts: [partSchema] },
  { idAttribute: "channelId" }
);
export const thechannelsSchema = [achannelSchema];

export const initialState = {
  byChannelId: {},
  allChannelIds: [],
  activeChannels: [],
  playingChannels: [],
};

// split into multiple reducers

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

    case ADD_A_PART:
      //TODO: add test
      const partId0 = action.payload.result;
      const part0 = action.payload.entities.byPartId[partId0];
      const channel0 = {
        ...state[part0.channelId]
      };
      const parts0 = [
        ...channel0.parts,
        partId0, // add new partId
      ];
      // and adjust duration
      const duration0 = Math.max(channel0.duration, part0.offset + part0.duration);
      return {
        ...state,
        [part0.channelId]: {
          ...channel0,
          parts: parts0,
          duration: duration0,
        }
      };

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

// selectors

export function getAllChannelIds(state) {
  return state.entities.channels.allChannelIds;
}

export function channelExists(state, channelId) {
  return getAllChannelIds(state).includes(channelId);
}

export function isChannelPlaying(state, channelId) {
  return state.entities.channels.playingChannels.includes(channelId);
}

export function isChannelActive(state, channelId) {
  return state.entities.channels.activeChannels.includes(channelId);
}

export function getNumChannels(state) {
  return getAllChannelIds(state).length;
}

export function getActiveChannelIds(state) {
  return state.entities.channels.activeChannels;
}

function _getChannelDuration(state, channelId) {
  const ch = _getChannel(state, channelId);
  return ch ? ch.duration : 0;
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

export const getDenormalizedChannel0 = (state, channelId) => {
  const channel = _getChannel(state, channelId);
  return channel ? denormalize(channel, achannelSchema, state.entities.parts) : null;
};

function _getEntities(state) {
  return {
    byChannelId: state.entities.channels.byChannelId,
    byPartId: state.entities.parts.byPartId,
    byImageId: state.entities.parts.byImageId,
  };
}

export const getDenormalizedChannel = (state, channelId) => {
  return channelExists(state, channelId) ?
    denormalize(channelId, achannelSchema, _getEntities(state)) : null;
};

export const getAllDenormalizedChannels = (state) => {
  return denormalize(getAllChannelIds(state), thechannelsSchema, _getEntities(state));
};