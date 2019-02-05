
import { UPLOAD_CONFIG_STARTED, UPLOAD_CONFIG_SUCCESS, UPLOAD_CONFIG_FAILURE } from './types';

import { downloadTextfile, readTextFile, downloadImagefile } from '../utils/fileUtils';
import { getConfig } from '../reducers/rootReducer';

import { addChannel, loadAChannel, updateChannelMarkersForLastAddedChannel } from './channelActions';
import { addImage, loadImage } from './imageListActions';
import { getChannelData, getMaxDuration } from '../reducers/channelReducer';
import { secondsToSamples } from '../utils/conversions';

// load channels and images from config

const uploadConfigStarted = startInfo => ({
  type: UPLOAD_CONFIG_STARTED,
  payload: startInfo
});

const uploadConfigSuccess = channelInfo => ({
  type: UPLOAD_CONFIG_SUCCESS,
  payload: channelInfo
});

const uploadConfigFailure = errorInfo => ({
  type: UPLOAD_CONFIG_FAILURE,
  payload: errorInfo
});

export const uploadConfigFile = (configFile, audioContext) => {
  return (dispatch, getState) => {
    dispatch(uploadConfigStarted());
    console.log("Reading " + configFile.name + "...");

    return readTextFile(configFile)
      .then((data) => {
        const dataObj = JSON.parse(data);
        dispatch(uploadConfig(dataObj, audioContext));
      })
      .then(dispatch(uploadConfigSuccess()))
      .catch(err => {
        console.error(err);
        return dispatch(uploadConfigFailure({
          err
        }))
      })
  }
}

export const uploadConfig = (configData, audioContext) => {
  return (dispatch, getState) => {

    console.log(configData);
    // dispatch(clearView());
    // dispatch(clearImageList());
    // dispatch(clearChannels());

    // load all images and save them to store
    const imageListPromises = configData.images.map((imageData) => loadImage(imageData)
      .then((img) => {
        dispatch(addImage(img));
      }));

    return Promise.all(imageListPromises)
      .then(() => {

        // load all channels
        const channelPromises = configData.channels.map((channelData) => loadAChannel(channelData, audioContext, getState())
          .then((channelInfo) => {
            if (channelInfo) { // audio channels are not loaded yet
              dispatch(addChannel(channelInfo));
              dispatch(updateChannelMarkersForLastAddedChannel()); // channelInfo does not know the channel id here...
            }
          }));

        return Promise.all(channelPromises);
      })
  }
};

export const downloadConfig = (() => {
  return (dispatch, getState) => {
    const config = getConfig(getState());
    downloadTextfile("config.json", JSON.stringify(config));
  }
})

// clear export image section (make black) 
export const clearExportImage = (numChannels) => {
  return (dispatch, getState) => {
    if (numChannels) {
      const maxDuration = getMaxDuration(getState());
      const canvas = document.getElementById("imageExportCanvas");
      canvas.height = numChannels * 30;
      canvas.width =  secondsToSamples(maxDuration, 100); // TODO: actual sample rate

      const cc = canvas.getContext('2d');
      cc.fillStyle = "black";
      cc.fillRect(0,0, canvas.width, canvas.height);
    }
  }
}

// draw a channel to the export at position idx
export const drawExportImage = (channelId, idx) => {
  return (dispatch, getState) => {
    const data = getChannelData(getState(), channelId);
    if (data && data.byPartId) {
      const canvas = document.getElementById("imageExportCanvas");
      const cc = canvas.getContext('2d');

      Object.keys(data.byPartId).forEach((partId) => {

        const part = data.byPartId[partId];
        const img = document.getElementById(part.imageId);
        const offsetPx = part.offset ? secondsToSamples(part.offset, data.sampleRate) : 0;
        const widthPx = part.duration ? secondsToSamples(part.duration, data.sampleRate) : 0;
        cc.drawImage(img, 0, 0, widthPx, 30,  offsetPx, idx*30, widthPx, 30);
      })
    }
  }
}

// export one channel
export const exportImageChannel = (channelId) => {
  return (dispatch, getState) => {
    dispatch(drawExportImage(channelId));
    const canvas = document.getElementById("imageExportCanvas");
    const resultImage = canvas.toDataURL("image/png");
    if (resultImage) {
      downloadImagefile(`result-${channelId}.png`, resultImage);
    }
  }
}

// during animation: get image data from export canvas within an interval
// assuming all selected channels are on the canvas
// to acoid retreiving the same frame twice
// we use ceil on the start idx and floor on the end idx
export const getChannelExportData = ((fromTime, toTime, sampleRate) => {
    const exportCanvas = document.getElementById("imageExportCanvas");
  if (exportCanvas) {
    const exportCc = exportCanvas.getContext('2d');
    const fromIdx = secondsToSamples(fromTime, sampleRate);
    const toIdx = secondsToSamples(toTime, sampleRate, false); // floor
    const width = toIdx-fromIdx;
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

