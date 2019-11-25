
import isElectron from "is-electron";
import LogScale from "log-scale";
import { LOAD_SHOW_STARTED, LOAD_SHOW_SUCCESS, LOAD_SHOW_FAILURE, LOAD_AUDIO_SUCCESS, LOAD_AUDIO_FAILURE, LOAD_AUDIO_STARTED } from "./types";

import { downloadTextfile, readTextFile, /* downloadImagefile, */ downloadBinaryFile, readAudioFile } from "../utils/fileUtils";

import { addChannel } from "./channelActions";
import { addImage, loadImage } from "./imageListActions";
import { addToUploadLog } from "./viewActions";

import { getMaxChannelDuration, getChannelGain, getChannelSampleRate, getChannelParts, getAllDenormalizedChannels } from "../reducers/channelReducer";
import { imageExists, getImageList } from "../reducers/imageListReducer";

import { secondsToSamples } from "../utils/conversions";
import { encodeImage } from "../utils/imageUtils";
import { getAllMarkersOfType } from "../reducers/markerReducer";
import { setOrReplaceMarker } from "./markerActions";


const logScale = new LogScale(0, 100);

// load channels and images from show file

const loadShowStarted = startInfo => ({
  type: LOAD_SHOW_STARTED,
  payload: startInfo,
});

const loadShowSuccess = channelInfo => ({
  type: LOAD_SHOW_SUCCESS,
  payload: channelInfo,
});

const loadShowFailure = errorInfo => ({
  type: LOAD_SHOW_FAILURE,
  payload: errorInfo,
});

export const loadShowFromFile = (showFile) => (dispatch, getState) => {
  dispatch(loadShowStarted());
  console.log(`Reading ${showFile.name}...`);

  return readTextFile(showFile)
    .then((data) => {
      const dataObj = JSON.parse(data);
      return dispatch(_uploadShow(dataObj));
    })
    .then(() => {
      return dispatch(loadShowSuccess());
    })
    .catch((err) => {
      console.error(err);
      return dispatch(loadShowFailure({
        err,
      }));
    });
};

const _uploadShow = (showData) => (dispatch, getState) => {

  console.log(showData);
  // dispatch(clearView());
  // dispatch(clearImageList());
  // dispatch(clearChannels());

  // load all non-existing images and save them to store
  const imageListPromises = showData.images
    .filter(imageData => !imageExists(getState(), imageData.imageId))
    .map(imageData => loadImage(imageData)
      .then((img) => {
        console.log(`loading image ${img.imageId}`);
        return dispatch(addImage(img));
      }));

  const markerPromises = showData.markers
    .map(marker => dispatch(setOrReplaceMarker(marker)));

  return Promise.all(imageListPromises)
    .then(() => {
      console.log("images loaded.");
      return Promise.all(markerPromises);
    })
    .then(() => {
      console.log("markers loaded.");

      // load all channels
      const channelPromises = showData.channels
        .map((channelData) => {
          if (channelData.type === "image") {
            const channelId = dispatch(addChannel(channelData));
            if (!channelId) {
              console.log("Loading image channel failed. Skipped channel...");
            } else {
              console.log(`${channelData.type} channel added.`);
            }
          } else {
            console.log(`Loading channel with type ${channelData.type} is not supported. Skipped channel...`);
          }
          return Promise.resolve();
        });

      return Promise.all(channelPromises);
    });
};

function removeObjectKeys(obj, keysToRemove) {
  return JSON.parse(JSON.stringify(obj, (k, v) => keysToRemove.includes(k) ? undefined : v));
}

export const saveShow = (() => (dispatch, getState) => {
  const show = {
    markers: getAllMarkersOfType(getState(), "timeScale"),
    images: getImageList(getState()),
    channels: removeObjectKeys(getAllDenormalizedChannels(getState()), ["partId", "channelId"])
  };
  downloadTextfile("show.json", JSON.stringify(show));
});

// clear export image section (make black)
export const clearExportImage = numChannels => (dispatch, getState) => {
  if (numChannels) {
    const maxDuration = getMaxChannelDuration(getState());
    const canvas = document.getElementById("imageExportCanvas");
    canvas.height = numChannels * 30;
    canvas.width = secondsToSamples(maxDuration, 100); // TODO: actual sample rate

    const cc = canvas.getContext("2d");
    cc.fillStyle = "black";
    cc.fillRect(0, 0, canvas.width, canvas.height);
  }
};

// draw a channel to the export at position idx
export const drawExportImage = (channelId, idx, applyLog) => (dispatch, getState) => {
  const chGain = getChannelGain(getState(), channelId);
  const sampleRate = getChannelSampleRate(getState(), channelId);
  const parts = getChannelParts(getState(), channelId);

  if (parts) {
    const canvas = document.getElementById("imageExportCanvas");
    const cc = canvas.getContext("2d");

    parts.forEach((part) => {

      const img = document.getElementById(part.imageId);
      const offsetPx = part.offset ? secondsToSamples(part.offset, sampleRate) : 0;
      const widthPx = part.duration ? secondsToSamples(part.duration, sampleRate) : 0;
      cc.drawImage(img, 0, 0, img.width, 30, offsetPx, idx * 30, widthPx, 30);
    });

    // apply gain by adding a transparent black rectangle on top of the parts
    if (chGain && chGain < 0.99) {
      // use log gain because otherwise it fades to strongly
      const gain = applyLog ? logScale.linearToLogarithmic(chGain) / 100 : chGain;

      cc.fillStyle = "black";
      cc.globalAlpha = 1.0 - gain;
      cc.fillRect(0, idx * 30, canvas.width, 30);
    }
  }
};

// export one channel to canvas and save as binary
export const saveImageChannelAsBinary = channelId => (dispatch, getState) => {
  dispatch(clearExportImage(1));
  dispatch(drawExportImage(channelId, 0, true));
  // binary download
  const data = getChannelExportData();

  // export/save binary encoded image for poi
  downloadBinaryFile(`result-${channelId}.poi`, encodeImage(data));

  // image file download
  /* const canvas = document.getElementById("imageExportCanvas");
  const resultImage = canvas.toDataURL("image/png");
  if (resultImage) {
    downloadImagefile(`result-${channelId}.png`, resultImage);
  } */
};

// export one channel to canvas and upload to poi
export const uploadImageChannelToPoi = channelId => (dispatch, getState) => {
  dispatch(clearExportImage(1));
  dispatch(drawExportImage(channelId, 0, true));
  // binary download
  const data = getChannelExportData();

  // export/save binary encoded image for poi
  if (isElectron()) {
    require("../utils/fileUtilsElectron")
      .uploadChannel(encodeImage(data), (text) => {
        console.log(text);
        dispatch(addToUploadLog(text));
      });
  }
};

// during animation or for upload
// get image data from export canvas within an interval
// assuming all active channels are on the canvas
// to acoid retreiving the same frame twice
// we use ceil on the start idx and floor on the end idx
// if fromTime and toTime are undefined: get complete canvas
export const getChannelExportData = ((fromTime, toTime, sampleRate) => {
  const exportCanvas = document.getElementById("imageExportCanvas");
  if (exportCanvas) {
    const exportCc = exportCanvas.getContext("2d");
    const fromIdx = fromTime ? secondsToSamples(fromTime, sampleRate) : 0;
    const toIdx = toTime ? secondsToSamples(toTime, sampleRate, false) : exportCanvas.width; // floor
    const width = toIdx - fromIdx;
    if (width > 0) {
      return exportCc.getImageData(fromIdx, 0, width, exportCanvas.height);
    }
  }
  return {
    width: 0,
    height: 0,
    data: [],
  };
});

// cancel any upload to poi (firmware or show)
export const cancelUpload = () => (dispatch, getState) => {
  if (isElectron()) {
    require("../utils/fileUtilsElectron")
      .killCurrentProcess();
  }
};

export const updateFirmware = () => (dispatch, getState) => {
  if (isElectron()) {
    require("../utils/fileUtilsElectron")
      .updateFirmware((text) => {
        console.log(text);
        dispatch(addToUploadLog(text));
      });
  } else {
    console.error("Firmware update only implemented for Electron.");
  }

};

// Audio file loading

const loadAudioStarted = startInfo => ({
  type: LOAD_AUDIO_STARTED
});

const loadAudioSuccess = channelInfo => ({
  type: LOAD_AUDIO_SUCCESS
});

const loadAudioFailure = errorInfo => ({
  type: LOAD_AUDIO_FAILURE,
  payload: errorInfo
});

// load audio file to channel
export const loadAudioFromFile = (audioFile, audioContext) => {
  return (dispatch, getState) => {
    dispatch(loadAudioStarted());
    console.log("Reading " + audioFile.name + "...");

    return readAudioFile(audioFile, audioContext)
      .then((audioBuffer) => {
        const channelInfo = {
          type: "audio",
          playState: "stopped", // TODO: remove
          src: audioFile.name,
          offset: 0,
          sampleRate: audioBuffer.sampleRate,
          gain: 1.0,
          buffer: audioBuffer,
          duration: audioBuffer.duration,
          active: true, // TODO: remove
          parts: [],
        };
        // console.log(channelInfo);
        dispatch(addChannel(channelInfo));
        dispatch(loadAudioSuccess());
        console.log("File read.");
      })
      .catch(err => {
        console.error(err);
        return dispatch(loadAudioFailure({
          err
        }));
      });
  };
};
