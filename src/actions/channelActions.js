import { normalize } from "normalizr";
import {
  PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE, ADD_CHANNEL, CLEAR_CHANNELS, UPLOAD_AUDIO_STARTED, UPLOAD_AUDIO_SUCCESS, UPLOAD_AUDIO_FAILURE, DELETE_CHANNEL, SET_CHANNEL_ACTIVE, UNSET_CHANNEL_ACTIVE, UPDATE_CHANNEL, ADD_A_CHANNEL, DELETE_A_CHANNEL, CLEAR_ALL_CHANNELS, SET_A_CHANNEL_ACTIVE, SET_A_CHANNEL_INACTIVE, PLAY_THE_CHANNELS, STOP_ALL_CHANNELS, STOP_A_CHANNEL,
} from "./types";

import { getActiveChannelIds, getMaxDuration, getChannel, getPartIdsInChannel, channelSchema2 } from "../reducers/channelReducer";
import { getImageDuration } from "../reducers/imageListReducer";
import { defaultSampleRate } from "../components/ImageListContainer";
import { readAudioFile } from "../utils/fileUtils";
import { drawExportImage, clearExportImage } from "./generalActions";
import { createPart, deleteAPart } from "./partActions";
import { deleteAMarker } from "./markerActions";
import { toggleEntitySelection } from "./entityActions";
import { getMaxChannelDuration, channelExists, getDenormalizedChannel } from "../reducers/achannelReducer";


// first id will be 1 to avoid falsy ids
let lastChannelIdCount = 0;

function generateId() {
  // simple generator :-)
  // other options: cuid or uuid
  lastChannelIdCount++;
  return "channel-" + lastChannelIdCount.toString();
}

// should only be used with care (e.g. in tests)
export function _resetId() {
  lastChannelIdCount = 0;
}
export function _setId(newId) {
  lastChannelIdCount = newId;
}

const _addAChannel = (channelInfo) => ({
  type: ADD_A_CHANNEL,
  payload: normalize(channelInfo, channelSchema2),
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
      channelInfo.channelId = generateId();

      // add parts and replace part field with partIds
      const partIds = [];
      channelInfo.parts.forEach((part) => {
        const partId = dispatch(createPart({
          ...part,
          channelId: channelInfo.channelId
        }));
        partIds.push(partId);
      });
      channelInfo.parts = partIds;

      // add channel with new channel id
      dispatch(_addAChannel(channelInfo));
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
  // no normalization should not be required since we can achieve this with channelId alone
  payload: channelId,
});

export const deleteAChannel = (channelId) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions

    if (channelId != null && channelExists(getState(), channelId)) {
      dispatch(_deleteAChannel(channelId));
    } else {
      console.error("cannot remove non-existing channelId:", channelId);
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

export const duplicateImageChannel = (channelId) => {
  return (dispatch, getState) => {

    const ch = getDenormalizedChannel(getState(), channelId);
    return dispatch(addAChannel(ch));
  };
};

/////////////// legacy function ////////////////

// add channel with channelInfo containing complete channel information

export const addChannel = (channelInfo) => ({
  type: ADD_CHANNEL,
  payload: channelInfo
});

// create an empty image channel
export const createImageChannel = () => {
  return (dispatch, getState) => {
    // we extend the duration to the longest channel
    const duration = Math.max(10, getMaxDuration(getState()));
    // add required fields
    dispatch(addChannel({
      type: "image",
      sampleRate: defaultSampleRate,
      active: true,
      playState: "stopped",
      gain: 1.0,
      duration,
    }));
  };
};

const _deleteChannel = channelInfo => ({
  type: DELETE_CHANNEL,
  payload: channelInfo
});

export const deleteChannel = (channelId) => {
  return (dispatch, getState) => {

    // first delete parts & markers of channel
    getPartIdsInChannel(getState(), channelId)
      .forEach((partId) => {
        dispatch(deleteAPart(partId));
      });

    // then delete channel
    dispatch(_deleteChannel(channelId));
  };
};

export const clearChannels = () => ({
  type: CLEAR_CHANNELS
});

export const setChannelActive = (channelInfo) => ({
  type: SET_CHANNEL_ACTIVE,
  payload: channelInfo
});

export const unsetChannelActive = (channelInfo) => ({
  type: UNSET_CHANNEL_ACTIVE,
  payload: channelInfo
});

export const updateChannel = (channelInfo) => ({
  type: UPDATE_CHANNEL,
  payload: channelInfo
});

const uploadAudioStarted = startInfo => ({
  type: UPLOAD_AUDIO_STARTED
});

const uploadAudioSuccess = channelInfo => ({
  type: UPLOAD_AUDIO_SUCCESS
});

const uploadAudioFailure = errorInfo => ({
  type: UPLOAD_AUDIO_FAILURE,
  payload: errorInfo
});

// helper function (no action): load a channel based on a channel config
export function loadAChannel(channelConfig, audioContext, state) {
  if (channelConfig.type === "audio") {
    return Promise.resolve(); // audio channels are curr. not loaded from config
  }
  return loadImageChannel(channelConfig, state);
}

function loadImageChannel(channelConfig, state) {

  // first normalize the parts
  // an incremented 'curid' is the part id used as key
  const normalizedParts = channelConfig.parts ?
    channelConfig.parts.reduce((res, part) => {
      part.partId = res.curid;
      part.duration = part.duration ?
        part.duration : getImageDuration(state, part.src);
      res[res.curid] = part;
      res.curid++;
      return res;
    }, {
      curid: 0
    }) : {};

  // incremented id no longer required
  normalizedParts &&
    delete normalizedParts.curid;
  delete channelConfig.parts;
  channelConfig.playState = "stopped";
  channelConfig.gain = channelConfig.gain || 1.0;

  return Promise.resolve({
    ...channelConfig,
    byPartId: normalizedParts
  });
}

// load audio file to studio
export const uploadAudioFile = (audioFile, audioContext) => {
  return (dispatch, getState) => {
    dispatch(uploadAudioStarted());
    console.log("Reading " + audioFile.name + "...");

    return readAudioFile(audioFile, audioContext)
      .then((audioBuffer) => {
        const channelInfo = {
          type: "audio",
          playState: "stopped",
          src: audioFile.name,
          offset: 0,
          sampleRate: audioBuffer.sampleRate,
          gain: 1.0,
          buffer: audioBuffer,
          duration: audioBuffer.duration,
          active: true,
        };
        // console.log(channelInfo);
        dispatch(addChannel(channelInfo));
        dispatch(uploadAudioSuccess());
        console.log("File read.");
      })
      .catch(err => {
        console.error(err);
        return dispatch(uploadAudioFailure({
          err
        }));
      });
  };
};

export const duplicateChannel = (channelId) => {
  return (dispatch, getState) => {
    const ch = getChannel(getState(), channelId);
    // also sanatizes the parts
    dispatch(addChannel(ch));
    // TODO: add new channel just after copied one
  };
};

// expected type:
// partInfo: {imageId, channelId, offset}
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

export const pastePart = () => {
  return (dispatch, getState) => {
    /* getPartsToCopy(getState()).forEach((part) => {
      const originialPart = getPart(getState(), part.channelId, part.partId);
      const selectedImageChannelId = getSelectedImageChannelId(getState());

      const partToPaste = {
        ...originialPart,
        channelId: selectedImageChannelId,
      };
      dispatch(insertNewPart(partToPaste));
    });*/
  };
};



// play related actions

export const playChannel = () => ({
  type: PLAY_CHANNELS
});

export const playChannelAndImage = () => {
  return (dispatch, getState) => {
    const selectedImageChannels = getActiveChannelIds(getState(), "image");
    dispatch(clearExportImage(selectedImageChannels.length));
    selectedImageChannels.map((channelId, idx) => dispatch(drawExportImage(channelId, idx)));
    dispatch(playChannel());
  };
};

export const stopChannel = () => ({
  type: STOP_CHANNELS
});

export const setChannelPlayState = (stateInfo) => ({
  type: SET_CHANNEL_PLAY_STATE,
  payload: stateInfo
});
