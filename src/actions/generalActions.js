
import isElectron from "is-electron";
import LogScale from "log-scale";
import { UPLOAD_CONFIG_STARTED, UPLOAD_CONFIG_SUCCESS, UPLOAD_CONFIG_FAILURE } from "./types";

import { downloadTextfile, readTextFile, /* downloadImagefile, */ downloadBinaryFile } from "../utils/fileUtils";

import { getConfig } from "../reducers/rootReducer";

import { addChannel, loadAChannel, updateChannelMarkersForLastAddedChannel } from "./channelActions";
import { addImage, loadImage } from "./imageListActions";
import { addToUploadLog } from "./viewActions";
import { getChannelData, getMaxDuration } from "../reducers/channelReducer";
import { imageExists } from "../reducers/imageListReducer";
import { secondsToSamples } from "../utils/conversions";
import { encodeImage } from "../utils/imageUtils";

const logScale = new LogScale(0, 100);

// load channels and images from config

const uploadConfigStarted = startInfo => ({
  type: UPLOAD_CONFIG_STARTED,
  payload: startInfo,
});

const uploadConfigSuccess = channelInfo => ({
  type: UPLOAD_CONFIG_SUCCESS,
  payload: channelInfo,
});

const uploadConfigFailure = errorInfo => ({
  type: UPLOAD_CONFIG_FAILURE,
  payload: errorInfo,
});

export const uploadConfigFile = (configFile, audioContext) => (dispatch, getState) => {
  dispatch(uploadConfigStarted());
  console.log(`Reading ${configFile.name}...`);

  return readTextFile(configFile)
    .then((data) => {
      const dataObj = JSON.parse(data);
      return dispatch(uploadConfig(dataObj, audioContext));
    })
    .then(() => {
      return dispatch(uploadConfigSuccess());
    })
    .catch((err) => {
      console.error(err);
      return dispatch(uploadConfigFailure({
        err,
      }));
    });
};

export const uploadConfig = (configData, audioContext) => (dispatch, getState) => {

  console.log(configData);
  // dispatch(clearView());
  // dispatch(clearImageList());
  // dispatch(clearChannels());

  // load all non-existing images and save them to store
  const imageListPromises = configData.images
    .filter(imageData => !imageExists(getState(), imageData.imageId))
    .map(imageData => loadImage(imageData)
      .then((img) => {
        console.log(`loading image ${img.imageId}`);
        return dispatch(addImage(img));
      }));

  return Promise.all(imageListPromises)
    .then(() => {
      console.log("images loaded.");

      // load all channels
      const channelPromises = configData.channels
        .map((channelData) => {
          return loadAChannel(channelData, audioContext, getState())
            .then((channelInfo) => {
              if (channelInfo) { // audio channels are not loaded yet
                dispatch(addChannel(channelInfo));
                console.log(`${channelData.type} channel added.`);
                dispatch(updateChannelMarkersForLastAddedChannel()); // channelInfo does not know the channel id here...
                console.log(`${channelData.type} channel: markers added.`);
              }
              return Promise.resolve();
            });
        });

      return Promise.all(channelPromises);
    });
};

export const downloadConfig = (() => (dispatch, getState) => {
  const config = getConfig(getState());
  downloadTextfile("config.json", JSON.stringify(config));
});

// clear export image section (make black)
export const clearExportImage = numChannels => (dispatch, getState) => {
  if (numChannels) {
    const maxDuration = getMaxDuration(getState());
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
  const data = getChannelData(getState(), channelId);
  if (data && data.byPartId) {
    const canvas = document.getElementById("imageExportCanvas");
    const cc = canvas.getContext("2d");

    Object.keys(data.byPartId).forEach((partId) => {

      const part = data.byPartId[partId];
      const img = document.getElementById(part.imageId);
      const offsetPx = part.offset ? secondsToSamples(part.offset, data.sampleRate) : 0;
      const widthPx = part.duration ? secondsToSamples(part.duration, data.sampleRate) : 0;
      cc.drawImage(img, 0, 0, img.width, 30, offsetPx, idx * 30, widthPx, 30);
    });

    // apply gain by adding a transparent black rectangle on top of the parts
    if (data.gain && data.gain < 0.99) {
      // use log gain because otherwise it fades to strongly
      const gain = applyLog ? logScale.linearToLogarithmic(data.gain) / 100 : data.gain;

      cc.fillStyle = "black";
      cc.globalAlpha = 1.0 - gain;
      cc.fillRect(0, idx * 30, canvas.width, 30);
    }
  }
};

export const downloadImageChannel = channelId => (dispatch, getState) => {
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

// export one channel
export const uploadImageChannel = channelId => (dispatch, getState) => {
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

// during animation: get image data from export canvas within an interval
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

export const cancelUpload = () => (dispatch, getState) => {
  if (isElectron()) {
    require("../utils/fileUtilsElectron")
      .killCurrentProcess();
  }
};

export const updateFirmware = (configData, audioContext) => (dispatch, getState) => {
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
