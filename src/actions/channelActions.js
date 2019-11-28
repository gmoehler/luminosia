import { normalize } from "normalizr";
import {
  UPDATE_CHANNEL, ADD_CHANNEL, DELETE_CHANNEL, CLEAR_CHANNELS,
  SET_CHANNEL_ACTIVE, SET_CHANNEL_INACTIVE, PLAY_CHANNELS,
  STOP_CHANNELS, STOP_CHANNEL,
} from "./types";

import { getImageDuration } from "../reducers/imageListReducer";
import { defaultSampleRate } from "../components/ImageListContainer";
import { drawExportImage, clearExportImage } from "./ioActions";
import { createPart, deletePart } from "./partActions";
import { deleteMarker } from "./markerActions";
import { toggleEntitySelection } from "./entityActions";
import {
  getMaxChannelDuration, channelExists, getDenormalizedChannel,
  achannelSchema, getActiveChannelIds, getChannelPartIds,
} from "../reducers/channelReducer";
import { pixelsToSeconds } from "../utils/conversions";
import { getResolution } from "../reducers/viewReducer";


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

const _addChannel = (channelInfo) => ({
  type: ADD_CHANNEL,
  payload: normalize(channelInfo, achannelSchema),
});

// add channel with channelInfo containing complete 
// denormalized channel information
export const addChannel = (channelInfo) => {
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
      // parts need to be at least 5 pixel wide when resizing
      channelInfo.minPartDuration = pixelsToSeconds(5, getResolution(getState()), channelInfo.sampleRate);
      // snap distance is 10 pixels (for each resolution)
      channelInfo.snapDist = pixelsToSeconds(10, getResolution(getState()), channelInfo.sampleRate);

      // add channel with new channel id, but without parts yet
      const parts = channelInfo.parts;
      dispatch(_addChannel({
        ...channelInfo,
        parts: [],
      }));

      // add parts (will also add it to the channel) 
      // audio channels have no parts and simply skipped this
      parts.forEach((part) => {
        dispatch(createPart({
          ...part,
          channelId: channelInfo.channelId,
        }, false)); // do not update selection for performance reasons
      });

      dispatch(setChannelActive(channelInfo.channelId));
      return channelInfo.channelId;
    }

    console.error("cannot add incomplete channel:", channelInfo);
    return null;
  };
};

// create an empty image channel
export const createImageChannel = () => {
  return (dispatch, getState) => {
    // we extend the duration to the longest channel
    const duration = Math.max(10, getMaxChannelDuration(getState()));
    // add required fields
    return dispatch(addChannel({
      type: "image",
      sampleRate: defaultSampleRate,
      duration,
      parts: [],
    }));
  };
};

const _deleteChannel = (channelId) => ({
  type: DELETE_CHANNEL,
  // no normalization required since we can achieve this with channelId alone
  payload: channelId,
});

export const deleteChannel = (channelId) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions

    if (channelId != null && channelExists(getState(), channelId)) {
      // first delete parts & markers of channel
      getChannelPartIds(getState(), channelId)
        .forEach((partId) => {
          dispatch(deletePart(partId));
        });

      // then delete channel      
      dispatch(_deleteChannel(channelId));
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

export const clearChannels = () => ({
  type: CLEAR_CHANNELS
});

export const setChannelActive = (channelId) => ({
  type: SET_CHANNEL_ACTIVE,
  payload: channelId
});

export const setChannelInactive = (channelId) => ({
  type: SET_CHANNEL_INACTIVE,
  payload: channelId
});

export const playTheChannels = (channelIds) => ({
  type: PLAY_CHANNELS,
  payload: channelIds
});

export const stopChannel = (channelId) => ({
  type: STOP_CHANNEL,
  payload: channelId,
});

export const stopChannels = () => ({
  type: STOP_CHANNELS
});

export const playActiveChannels = () => {
  return (dispatch, getState) => {
    const chs = getActiveChannelIds(getState());
    dispatch(playTheChannels(chs));
  };
};

export const playChannelAndImage = () => {
  return (dispatch, getState) => {
    const activeImageChannels = getActiveChannelIds(getState(), "image");
    dispatch(clearExportImage(activeImageChannels.length));
    activeImageChannels.map((channelId, idx) => dispatch(drawExportImage(channelId, idx)));
    dispatch(playActiveChannels());
  };
};

export const duplicateImageChannel = (channelId) => {
  return (dispatch, getState) => {

    const ch = getDenormalizedChannel(getState(), channelId);
    return dispatch(addChannel(ch));
  };
};

export const duplicateChannel = (channelId) => {
  return (dispatch, getState) => {
    const ch = getDenormalizedChannel(getState(), channelId);
    dispatch(addChannel(ch));
  };
};

// expected type:
// partInfo: {imageId, channelId, offset, duration}
export const insertNewPart = (partInfo) => {
  return (dispatch, getState) => {

    // remove insertion marker
    dispatch(deleteMarker("insert"));

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
