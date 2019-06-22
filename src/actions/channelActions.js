import { PLAY_CHANNELS, STOP_CHANNELS, SET_CHANNEL_PLAY_STATE, MOVE_PART, ADD_PART, DELETE_PART, ADD_CHANNEL, CLEAR_CHANNELS, UPLOAD_AUDIO_STARTED, UPLOAD_AUDIO_SUCCESS, UPLOAD_AUDIO_FAILURE, DELETE_CHANNEL, SET_CHANNEL_ACTIVE, UNSET_CHANNEL_ACTIVE, UPDATE_CHANNEL, RESIZE_PART } from "./types";

import { setMarker, deleteMarker, toggleElementSelection, remElemFromSel, addPartToMultiSelection, clearElementSelectionWithMarkers, syncMarkersForPart } from "./viewActions";

import { getNextPartId, getLastChannel, getActiveChannelIds, getMaxDuration, getChannelData, getPart, getElementType } from "../reducers/channelReducer";
import { getSelectedImageChannelId, getPartsToCopy, getSelectedElements, getSelectedParts, isElementSelected } from "../reducers/viewReducer";
import { getImageDuration } from "../reducers/imageListReducer";
import { removeImage } from "./imageListActions";
import { defaultSampleRate } from "../components/ImageListContainer";
import { readAudioFile } from "../utils/fileUtils";
import { drawExportImage, clearExportImage } from "./generalActions";

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
  channelConfig.lastPartSeqNum = Object.keys(normalizedParts).length - 1;
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
    const ch = getChannelData(getState(), channelId);
    // also sanatizes the parts
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
          markerId: `${partId}-l`,
          channelId: channelId,
          partId: partId,
          pos: part.offset,
          minPos: 0,
          type: "normal"
        }));
        dispatch(setMarker({
          markerId: `${partId}-r`,
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

    // clone, but remove src if existing
    // remove src is probably no longer required
    // since we always get the image from the ImageList
    const partWithoutSrc = {
      ...partInfo
    };
    delete partWithoutSrc.src;

    // remember partid that new part will have to re-use for markers
    const nextPartId = getNextPartId(getState(), partInfo.channelId);
    dispatch(addPart(partWithoutSrc));

    // generate markers for part
    dispatch(setMarker({
      markerId: `${nextPartId}-l`,
      channelId: partInfo.channelId,
      partId: nextPartId,
      pos: partInfo.offset,
      minPos: 0,
      type: "normal"
    }));
    dispatch(setMarker({
      markerId: `${nextPartId}-r`,
      channelId: partInfo.channelId,
      partId: nextPartId,
      pos: partInfo.offset + partInfo.duration,
      minPos: partInfo.duration,
      type: "normal"
    }));


    // select the new part
    const lastPart = {
      channelId: partInfo.channelId,
      partId: nextPartId,
      selected: true,
    };
    dispatch(toggleElementSelection(lastPart));
  };
};

export const pastePart = () => {
  return (dispatch, getState) => {
    getPartsToCopy(getState()).forEach((part) => {
      const originialPart = getPart(getState(), part.channelId, part.partId);
      const selectedImageChannelId = getSelectedImageChannelId(getState());

      const partToPaste = {
        ...originialPart,
        channelId: selectedImageChannelId,
      };
      dispatch(insertNewPart(partToPaste));
    });
  };
};

export const addPart = (partInfo) => ({
  type: ADD_PART,
  payload: partInfo
});

export const deleteSelectedPartAndMarkers = () => {
  return (dispatch, getState) => {
    getSelectedElements(getState()).forEach((elemInfo) => {
      const type = getElementType(elemInfo);

      if (type === "part") {
        dispatch(deletePart(elemInfo));
        dispatch(deleteMarker({
          markerId: `${elemInfo.partId}-l`
        }));
        dispatch(deleteMarker({
          markerId: `${elemInfo.partId}-r`
        }));
        dispatch(remElemFromSel(elemInfo));
      }
      if (type === "image") {
        dispatch(removeImage(elemInfo));
      }
    });
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

export const movePart = (moveInfo) => ({
  type: MOVE_PART,
  payload: moveInfo
});

export const resizePart = (resizeInfo) => ({
  type: RESIZE_PART,
  payload: resizeInfo
});

export const resizePartWithMarkers = (resizeInfo) => {
  return (dispatch, getState) => {

    // exclusively select part for resizing
    dispatch(clearElementSelectionWithMarkers());
    dispatch(addPartToMultiSelection(resizeInfo));

    dispatch(resizePart(resizeInfo));
    dispatch(syncMarkersForPart(resizeInfo.channelId, resizeInfo.partId));
  };
};

export const moveSelectedPartsWithMarkers = (moveInfo) => {
  return (dispatch, getState) => {
    if (!isElementSelected(getState(), moveInfo)) {
      // if part was not selected then exclusively 
      // select it for move
      dispatch(clearElementSelectionWithMarkers());
      dispatch(addPartToMultiSelection(moveInfo));
    }
    getSelectedParts(getState()).forEach((part) => {
      dispatch(movePart({
        ...part,
        incr: moveInfo.incr,
      }));
      dispatch(syncMarkersForPart(moveInfo.channelId, moveInfo.partId));
    });
  };
};
