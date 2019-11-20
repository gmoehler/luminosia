// reducer working on the part entities

import { combineReducers } from "redux";
import { denormalize, schema } from "normalizr";

import { ADD_CHANNEL, DELETE_CHANNEL, CLEAR_CHANNELS, SET_CHANNEL_INACTIVE, PLAY_CHANNELS, STOP_CHANNELS, STOP_CHANNEL, SET_CHANNEL_ACTIVE, ADD_PART, UPDATE_CHANNEL, DELETE_PART } from "../actions/types";
import { partSchema, getParts, } from "./partReducer";
import { getSelectedImageChannelId } from "./viewReducer";

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

    case ADD_CHANNEL: {
      return {
        ...state,
        ...action.payload.entities.byChannelId, // normalized channels
      };
    }
    case DELETE_CHANNEL:
      const newState = {
        ...state
      };
      delete newState[action.payload];
      return newState;

    case CLEAR_CHANNELS:
      return {};

    case ADD_PART:
      //TODO: add test
      const partId0 = action.payload.result;
      const part0 = action.payload.entities.byPartId[partId0];
      const channel0 = {
        ...state[part0.channelId]
      };
      if (!channel0) {
        return state;
      }
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

    case DELETE_PART:
      //TODO: add test
      const partId2 = action.payload.partId;
      const channelId2 = action.payload.channelId;
      const channel2 = {
        ...state[channelId2]
      };
      const parts2 = channel2.parts.filter(p => p !== partId2);
      // TODO: adjust duration
      return {
        ...state,
        [channelId2]: {
          ...channel2,
          parts: parts2,
        }
      };

    case UPDATE_CHANNEL:
      const channelId1 = action.payload.channelId;
      const channel1 = {
        ...state[channelId1]
      };
      return {
        ...state,
        [channelId1]: {
          ...channel1,
          ...action.payload
        }
      };

    default:
      return state;
  }
};

const allChannelIds = (state = [], action) => {
  switch (action.type) {

    case ADD_CHANNEL:
      return [...state, action.payload.result];

    case DELETE_CHANNEL:
      return state.filter(p => p !== action.payload);

    case CLEAR_CHANNELS:
      return [];

    default:
      return state;
  }
};

const activeChannels = (state = [], action) => {
  switch (action.type) {

    case SET_CHANNEL_ACTIVE:
      return [...state, action.payload];

    case DELETE_CHANNEL:
    case SET_CHANNEL_INACTIVE:
      return state.filter(p => p !== action.payload);

    case CLEAR_CHANNELS:
      return [];

    default:
      return state;
  }
};

const playingChannels = (state = [], action) => {
  switch (action.type) {

    case PLAY_CHANNELS:
      return [...state, ...action.payload];

    case DELETE_CHANNEL:
    case STOP_CHANNEL:
      return state.filter(p => p !== action.payload);

    case CLEAR_CHANNELS:
    case STOP_CHANNELS:
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
  return state.entities.channels.allChannelIds
    .sort((chId1, chId2) => {
      // return audio channels first
      return chId1.localeCompare(chId2);
    });
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

export function allChannelsStopped(state) {
  return state.entities.channels.playingChannels.length === 0;
}

export function getActiveChannelIds(state) {
  return state.entities.channels.activeChannels;
}

function _getChannel(state, channelId) {
  if (!channelExists(state, channelId)) {
    return null;
  }
  return state.entities.channels.byChannelId[channelId];
}

function _getChannelDuration(state, channelId) {
  const ch = _getChannel(state, channelId);
  return ch ? ch.duration : 0;
}

export function getChannelGain(state, channelId) {
  const ch = _getChannel(state, channelId);
  return ch ? ch.gain : 0;
}

export function getChannelSampleRate(state, channelId) {
  const ch = _getChannel(state, channelId);
  return ch ? ch.sampleRate : 0;
}

export function getChannelMinPartDuration(state, channelId) {
  const ch = _getChannel(state, channelId);
  return ch ? ch.minPartDuration : 0;
}

export function getChannelSnapDist(state, channelId) {
  const ch = _getChannel(state, channelId);
  return ch ? ch.snapDist : 0;
}

export function getChannelPartIds(state, channelId) {
  const ch = _getChannel(state, channelId);
  return ch ? ch.parts : 0;
}

export function getChannelParts(state, channelId) {
  const ch = _getChannel(state, channelId);
  return ch ? getParts(state, ch.parts) : [];
}

// get the subpart of the channel that is needed for the channel display
export function getChannelData(state, channelId) {

  const { type, sampleRate, duration, parts, buffer, ...remainingObj } = _getChannel(state, channelId); // eslint-disable-line no-unused-vars
  const active = isChannelActive(state, channelId);
  const selected = getSelectedImageChannelId(state) === channelId;
  return {
    channelId, type, active, sampleRate, duration,
    parts, selected, buffer
  };
}

// get the subpart of the channel that is needed for the channel selector
export function getChannelSelectorData(state, channelId) {
  // eslint-disable-next-line no-unused-vars
  const { type, gain, ...remainingObj } = _getChannel(state, channelId);
  const active = isChannelActive(state, channelId);
  const selected = getSelectedImageChannelId(state) === channelId;
  return {
    channelId, type, gain, active, selected
  };
}

export const getMaxChannelDuration = state => (getNumChannels(state) === 0 ?
  0 : state.entities.channels.allChannelIds
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
