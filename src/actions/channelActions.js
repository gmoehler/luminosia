import { normalize } from "normalizr";
import {
  UPDATE_CHANNEL, ADD_A_CHANNEL, DELETE_A_CHANNEL, CLEAR_ALL_CHANNELS,
  SET_A_CHANNEL_ACTIVE, SET_A_CHANNEL_INACTIVE, PLAY_THE_CHANNELS,
  STOP_ALL_CHANNELS, STOP_A_CHANNEL,
} from "./types";

import { getImageDuration } from "../reducers/imageListReducer";
import { defaultSampleRate } from "../components/ImageListContainer";
import { drawExportImage, clearExportImage } from "./ioActions";
import { createPart, deleteAPart } from "./partActions";
import { deleteAMarker } from "./markerActions";
import { toggleEntitySelection } from "./entityActions";
import {
  getMaxChannelDuration, channelExists, getDenormalizedChannel,
  achannelSchema, getActiveChannelIds, getChannelPartIds,
} from "../reducers/channelReducer";
import { incrLoadProgress, initLoadProgress } from "./viewActions";


// first id will be 1 to avoid falsy ids
let lastChannelIdCount = 0;

function generateId(channelType) {
  // simple generator :-)
  // other options: cuid or uuid
  lastChannelIdCount++;
  return "channel-" + channelType + "-" + lastChannelIdCount.toString();
}

// should only be used with care (e.g. in tests)
export function _resetId() {
  lastChannelIdCount = 0;
}
export function _setInitialChannelIdCount(newCount) {
  lastChannelIdCount = newCount;
}

const _addAChannel = (channelInfo) => ({
  type: ADD_A_CHANNEL,
  payload: normalize(channelInfo, achannelSchema),
});

// add channel with channelInfo containing complete 
// denormalized channel information
export const addAChannel = (channelInfo) => {
  return (dispatch, getState) => {

    // check requirements for channels
    if (channelInfo.sampleRate &&
      channelInfo.duration &&
      Array.isArray(channelInfo.parts) &&

      ((channelInfo.type === "image")
        ||
        (channelInfo.type === "audio" &&
          channelInfo.buffer && channelInfo.src)
      )) {

      // add tags that are not usually externalized
      channelInfo.gain = channelInfo.gain || 1;
      channelInfo.channelId = generateId(channelInfo.type);

      // add channel with new channel id, but without parts yet
      const parts = channelInfo.parts;
      dispatch(_addAChannel({
        ...channelInfo,
        parts: [],
      }));

      // add parts (will also add it to the channel) 
      // audio channels have no parts and simply skipped this
      const numParts = parts.length;
      dispatch(initLoadProgress(numParts));
      parts.forEach((part) => {
        dispatch(createPart({
          ...part,
          channelId: channelInfo.channelId,
        }, false)); // do not update selection for performance reasons
        dispatch(incrLoadProgress());
      });

      dispatch(setAChannelActive(channelInfo.channelId));
      return channelInfo.channelId;
    }

    console.error("cannot add incomplete channel:", channelInfo);
    return null;
  };
};

// create an empty image channel
export const createAnImageChannel = () => {
  return (dispatch, getState) => {
    // we extend the duration to the longest channel
    const duration = Math.max(10, getMaxChannelDuration(getState()));
    // add required fields
    return dispatch(addAChannel({
      type: "image",
      sampleRate: defaultSampleRate,
      duration,
      parts: [],
    }));
  };
};

const _deleteAChannel = (channelId) => ({
  type: DELETE_A_CHANNEL,
  // no normalization required since we can achieve this with channelId alone
  payload: channelId,
});

export const deleteAChannel = (channelId) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions

    if (channelId != null && channelExists(getState(), channelId)) {
      // first delete parts & markers of channel
      getChannelPartIds(getState(), channelId)
        .forEach((partId) => {
          dispatch(deleteAPart(partId));
        });

      // then delete channel      
      dispatch(_deleteAChannel(channelId));
    } else {
      console.error("cannot remove non-existing channelId:", channelId);
    }
  };
};

const _updateChannel = (channelInfo) => ({
  type: UPDATE_CHANNEL,
  payload: channelInfo
});

export const updateChannel = (channelInfo) => {
  return (dispatch, getState) => {

    const { channelId, ...updateInfo } = channelInfo;

    if (channelId != null && channelExists(getState(), channelId)
      && updateInfo) {
      return dispatch(_updateChannel(channelInfo));
    } else {
      console.error("cannot update channel:", channelInfo);
    }
  };
};

export const clearAllChannels = () => ({
  type: CLEAR_ALL_CHANNELS
});

export const setAChannelActive = (channelId) => ({
  type: SET_A_CHANNEL_ACTIVE,
  payload: channelId
});

export const unsetAChannelActive = (channelId) => ({
  type: SET_A_CHANNEL_INACTIVE,
  payload: channelId
});

export const playTheChannels = (channelIds) => ({
  type: PLAY_THE_CHANNELS,
  payload: channelIds
});

export const stopAChannel = (channelId) => ({
  type: STOP_A_CHANNEL,
  payload: channelId,
});

export const stopAllChannels = () => ({
  type: STOP_ALL_CHANNELS
});

export const playActiveChannels = () => {
  return (dispatch, getState) => {
    const chs = getActiveChannelIds(getState());
    dispatch(playTheChannels(chs));
  };
};

export const playChannelAndImage = () => {
  return (dispatch, getState) => {
    const selectedImageChannels = getActiveChannelIds(getState(), "image");
    dispatch(clearExportImage(selectedImageChannels.length));
    selectedImageChannels.map((channelId, idx) => dispatch(drawExportImage(channelId, idx)));
    dispatch(playActiveChannels());
  };
};

export const duplicateImageChannel = (channelId) => {
  return (dispatch, getState) => {

    const ch = getDenormalizedChannel(getState(), channelId);
    return dispatch(addAChannel(ch));
  };
};

export const duplicateChannel = (channelId) => {
  return (dispatch, getState) => {
    const ch = getDenormalizedChannel(getState(), channelId);
    dispatch(addAChannel(ch));
  };
};

// expected type:
// partInfo: {imageId, channelId, offset, duration}
export const insertNewPart = (partInfo) => {
  return (dispatch, getState) => {

    // remove insertion marker
    dispatch(deleteAMarker("insert"));

    const duration = getImageDuration(
      getState(), partInfo.imageId);

    // creates part and adds it to the channel
    const pId = dispatch(createPart({
      ...partInfo,
      duration
    }));

    // select the new part
    dispatch(toggleEntitySelection(pId));
  };
};
