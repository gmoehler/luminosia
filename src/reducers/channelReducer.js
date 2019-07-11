import { merge, cloneDeep } from "lodash";

import { ADD_CHANNEL, CLEAR_CHANNELS, PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE, MOVE_PART, RESIZE_PART, ADD_A_PART, ADD_PART, DELETE_PART, DELETE_A_PART, DELETE_CHANNEL, SET_CHANNEL_ACTIVE, UNSET_CHANNEL_ACTIVE, UPDATE_CHANNEL,
} from "../actions/types";

import { filterObjectByKeys } from "../utils/miscUtils";

// TODO: improve this reducer using a sub-reducer on the selected channel

const initialState = {
  byChannelId: {},
  lastChannelId: -1,
};

export default (state = initialState, action) => {
  switch (action.type) {

    case CLEAR_CHANNELS:
      return initialState;

    case ADD_CHANNEL:
      const channelId = state.lastChannelId + 1;

      // update partId & channelId in all parts
      const newByPartId = {};
      let partSeqNum = -1;
      Object.keys(action.payload.byPartId || {}).forEach((oldPartId) => {
        const part = cloneDeep(action.payload.byPartId[oldPartId]);
        const partId = generatePartId(channelId, ++partSeqNum);
        part.channelId = channelId;
        part.partId = partId;
        newByPartId[partId] = part;
      });

      return {
        ...state,
        lastChannelId: channelId,
        byChannelId: {
          ...state.byChannelId,
          [channelId]: {
            ...action.payload,
            channelId,
            lastPartSeqNum: partSeqNum,
            byPartId: newByPartId,
            allPartIds: [],
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
      // add part to allPartIds array
      const channelCopy0 = {
        ...state.byChannelId[action.payload.channelId]
      };
      const newAllPartIds0 = [
        ...channelCopy0.allPartIds,
        action.payload.partId,
      ];

      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload.channelId]: {
            ...channelCopy0,
            allPartIds: newAllPartIds0,
          }
        }
      };

    case ADD_PART:
      if (!action.payload.imageId) {
        return state;
      }
      const partSeqNum1 = state.byChannelId[action.payload.channelId].lastPartSeqNum + 1;
      const partId = generatePartId(action.payload.channelId, partSeqNum1);
      const maxDuration = Math.max(state.byChannelId[action.payload.channelId].duration,
        action.payload.offset + action.payload.duration);
      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload.channelId]: {
            ...state.byChannelId[action.payload.channelId],
            lastPartSeqNum: partSeqNum1,
            duration: maxDuration,
            byPartId: {
              ...state.byChannelId[action.payload.channelId].byPartId,
              [partId]: {
                partId,
                src: action.payload.src,
                imageId: action.payload.imageId,
                offset: action.payload.offset,
                duration: action.payload.duration,
              },
            },
          },
        },
      };

    case DELETE_A_PART:
      // remove part from allPartIds array
      const channelCopy1 = {
        ...state.byChannelId[action.payload.channelId]
      };
      const newAllPartIds1 = [
        ...channelCopy1.allPartIds.filter(id => id !== action.payload.partId)
      ];

      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload.channelId]: {
            ...channelCopy1,
            allPartIds: newAllPartIds1,
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
            byPartId: parts,
          },
        },
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

    case MOVE_PART:
      // moving parts within a channel
      const channel = state.byChannelId[action.payload.channelId];
      const part = channel.byPartId[action.payload.partId];
      const currentOffset = part.offset || 0;
      const offsetIncr = action.payload.incr || 0;
      const updatedOffset = currentOffset + offsetIncr;
      const mergedPart = {
        ...part,
        offset: Math.max(0, updatedOffset),
      };
      const mergedMoveChannelState = merge({},
        channel,
        {
          byPartId: {
            [action.payload.partId]: mergedPart,
          },
        },
      );

      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload.channelId]: mergedMoveChannelState,
        },
      };

    case RESIZE_PART:
      // sizing part by moving either left or right marker
      const channel1 = state.byChannelId[action.payload.channelId];
      const part1 = channel1.byPartId[action.payload.partId];
      const currentOffset1 = part1.offset || 0;

      let updatedOffset1 = currentOffset1;
      let updatedDuration1 = part1.duration;

      // left marker moved (bounds: 0 & end of part)
      if (action.payload.markerId && action.payload.markerId.includes("l")) {
        const maxOffset = part1.offset + part1.duration;
        if (action.payload.incr > 0) { // moving right: cannot exceed right end of part
          updatedDuration1 = Math.max(0, updatedDuration1 - action.payload.incr);
          if (updatedDuration1 === 0) { // never allow duration 0
            updatedDuration1 = part1.duration;
          }
          updatedOffset1 = maxOffset - updatedDuration1;
        } else { // move left: cannot be left of 0
          updatedOffset1 = Math.max(0, updatedOffset1 + action.payload.incr);
          updatedDuration1 = maxOffset - updatedOffset1;
        }
      } else { // right marker moved (bound: start of part)
        updatedDuration1 = Math.max(0, updatedDuration1 + action.payload.incr);
        if (updatedDuration1 === 0) { // never allow duration 0
          updatedDuration1 = part1.duration;
        }
      }

      const mergedPart1 = {
        ...part1,
        duration: updatedDuration1,
        offset: updatedOffset1,
      };
      const mergedResizeChannelState1 = merge({},
        channel1,
        {
          byPartId: {
            [action.payload.partId]: mergedPart1,
          },
        },
      );

      return {
        ...state,
        byChannelId: {
          ...state.byChannelId,
          [action.payload.channelId]: mergedResizeChannelState1,
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

// channel data sorted by type and id
export const getAllChannelsData = state => Object.values(state.channel.byChannelId)
  .sort((ch1, ch2) => {
    const str1 = ch1.type + ch1.channelId;
    const str2 = ch2.type + ch2.channelId;
    return str1.localeCompare(str2);
  });

export const getAllChannelsOverview = state => getAllChannelsData(state)
  .map(channel => ({
    channelId: channel.channelId,
    type: channel.type,
    active: channel.active,
    gain: channel.gain,
  }));

export const getChannelData = (state, channelId) => state.channel.byChannelId[channelId];

export const getChannelIds = state => Object.keys(state.channel.byChannelId);

export const getPart = (state, channelId, partId) => state.channel.byChannelId[channelId].byPartId[partId];

export const getPartRefsInInterval = (state, channelId, from, to) => {
  const ch = state.channel.byChannelId[channelId];
  if (ch && Object.keys(ch.byPartId) && Object.keys(ch.byPartId).length > 0) {
    return Object.values(ch.byPartId).filter(
      part => part.offset + part.duration > from && part.offset < to,
    ).map(part => ({
      channelId,
      partId: part.partId,
    }));
  }
  return [];

};

export const getLastChannelId = state => state.channel.lastChannelId;

export const getLastChannel = (state) => {
  const { lastChannelId } = state.channel;
  return state.channel.byChannelId[lastChannelId];
};

export const getNextPartId = (state, channelId) => {
  const nextPartSeqNum = state.channel.byChannelId[channelId].lastPartSeqNum + 1;
  return `${channelId}:${nextPartSeqNum}`;
};

function generatePartId(channelId, partSeqId) {
  return `${channelId}:${partSeqId}`;
}

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

export const getPartIds = (state, channelId) => {
  return Object.keys(state.channel.byChannelId[channelId].byPartId);
};

export const getActiveChannelIds = (state, type) => Object.values(state.channel.byChannelId)
  .filter(channel => channel.active && (!type || channel.type === type))
  .map(channel => channel.channelId);

export function getElementType(elementInfo) {
  // check this first because parts also have imageId
  if (elementInfo.partId) {
    return "part";
  }
  if (elementInfo.imageId) {
    return "image";
  }
  return null;
}
