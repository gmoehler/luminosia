import { PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE, MOVE_CHANNEL, ADD_PART, DELETE_PART, ADD_CHANNEL, CLEAR_CHANNELS, UPLOAD_AUDIO_STARTED, UPLOAD_AUDIO_SUCCESS, UPLOAD_AUDIO_FAILURE, DELETE_CHANNEL, SET_CHANNEL_ACTIVE, UNSET_CHANNEL_ACTIVE } from "./types";

import { setMarker, deleteMarker, deselect, selectPartOrImage } from "./viewActions";

import { getLastPartId, getLastChannel, getActiveChannelIds, getMaxDuration, getChannelData, getPart } from "../reducers/channelReducer";
import { getSelectedPart, getSelectedImage, getSelectedImageChannelId, getPartToCopy } from "../reducers/viewReducer";
import { getImageDuration } from "../reducers/imageListReducer";
import { removeImage } from "./imageListActions";
import { defaultSampleRate } from "../components/ImageListContainer";
import { readAudioFile } from "../utils/fileUtils";
import { drawExportImage, clearExportImage } from "./generalActions";

// load channel from config

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
      duration,
    }));
  };
};

export const deleteChannel = channelInfo => ({
  type: DELETE_CHANNEL,
  payload: channelInfo
});

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
  // an icremented 'curid' is the part id used as key
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
  channelConfig.lastPartId = Object.keys(normalizedParts).length - 1;
  channelConfig.playState = "stopped";

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
    const ch = getChannelData(getState(), channelId);
    dispatch(addChannel(ch));
    // TODO: add new channel just after copied one
    dispatch(updateChannelMarkersForLastAddedChannel()); // although we do know the channel id here...
  };
};

export const updateChannelMarkersForLastAddedChannel = () => {
  return (dispatch, getState) => {

    const lastChannel = getLastChannel(getState());
    if (lastChannel) {
      const channelId = lastChannel.channelId;

      Object.keys(lastChannel.byPartId).forEach((partId) => {

        const part = lastChannel.byPartId[partId];
        dispatch(setMarker({
          markerId: `${channelId}-${partId}-l`,
          channelId: channelId,
          partId: partId,
          pos: part.offset,
          minPos: 0,
          type: "normal"
        }));
        dispatch(setMarker({
          markerId: `${channelId}-${partId}-r`,
          channelId: channelId,
          partId: partId,
          pos: part.offset + part.duration,
          minPos: part.duration,
          type: "normal"
        }));
      });
    }
  };
};

export const insertNewPart = (partInfo) => {
  return (dispatch, getState) => {

    // remove insertion marker
    dispatch(deleteMarker({
      markerId: "insert"
    }));

    // clone
    const partWithoutSrc = {
      ...partInfo
    };
    delete partWithoutSrc.src;

    dispatch(addPart(partWithoutSrc));
    const lastPartId = getLastPartId(getState(), partInfo.channelId);
    // generate markers for part
    dispatch(setMarker({
      markerId: `${partInfo.channelId}-${lastPartId}-l`,
      channelId: partInfo.channelId,
      partId: lastPartId,
      pos: partInfo.offset,
      minPos: 0,
      type: "normal"
    }));
    dispatch(setMarker({
      markerId: `${partInfo.channelId}-${lastPartId}-r`,
      channelId: partInfo.channelId,
      partId: lastPartId,
      pos: partInfo.offset + partInfo.duration,
      minPos: partInfo.duration,
      type: "normal"
    }));


    // select the new part
    const lastPart = {
      channelId: partInfo.channelId,
      partId: lastPartId,
      selected: true,
    };
    dispatch(selectPartOrImage(lastPart));
  };
};

export const pastePart = () => {
  return (dispatch, getState) => {
    const partToCopyInfo = getPartToCopy(getState());
    const originialPart = getPart(getState(), partToCopyInfo.channelId, partToCopyInfo.partId);
    const selectedImageChannelId = getSelectedImageChannelId(getState());

    const partToPaste = {
      ...originialPart,
      channelId: selectedImageChannelId,
    };
    dispatch(insertNewPart(partToPaste));
  };
};

export const addPart = (partInfo) => ({
  type: ADD_PART,
  payload: partInfo
});

export const deleteSelectedPartAndMarkers = () => {
  return (dispatch, getState) => {
    const selPart = getSelectedPart(getState());
    const selImage = getSelectedImage(getState());
    if (selPart) {
      dispatch(deletePart(selPart));
      dispatch(deleteMarker({
        markerId: `${selPart.channelId}-${selPart.partId}-l`
      }));
      dispatch(deleteMarker({
        markerId: `${selPart.channelId}-${selPart.partId}-r`
      }));
      dispatch(deselect());
    }
    if (selImage) {
      dispatch(removeImage(selImage));
    }
  };
};

export const deletePart = partInfo => ({
  type: DELETE_PART,
  payload: partInfo
});


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

export const moveChannel = (moveInfo) => ({
  type: MOVE_CHANNEL,
  payload: moveInfo
});

