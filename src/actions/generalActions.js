
import { 
  UPLOAD_CONFIG_STARTED, UPLOAD_CONFIG_SUCCESS, UPLOAD_CONFIG_FAILURE
} from './types';

import { downloadTextfile, readTextFile } from '../utils/fileUtils';
import { getConfig } from '../reducers/rootReducer';

import { addChannel, clearChannels, loadAChannel, updateChannelMarkers } from './channelActions';
import { addImage, clearImageList, loadImage } from './imageListActions';
import { clearView } from './viewActions';

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
    console.log("Reading " + configFile.name  + "...");

    return readTextFile(configFile)
      .then((data) => {
        const dataObj = JSON.parse(data);
        dispatch(uploadConfig(dataObj, audioContext));
      })
      .then (dispatch(uploadConfigSuccess()))
      .catch(err => {
        console.error(err);
        return dispatch(uploadConfigFailure({ err }))
      })
  }
}

export const uploadConfig = (configData, audioContext) => {
  return (dispatch, getState) => {
    
    console.log(configData);
    dispatch(clearView());
    dispatch(clearImageList());
    dispatch(clearChannels());

    // load all images
    const imageListPromises = configData.images.map((imageData) => 
      loadImage(imageData) 
      .then((img) => dispatch(addImage(img))));

    return Promise.all(imageListPromises)
      .then(() => {

        // load all channels
        const channelPromises = configData.channels.map((channelData) => 
          loadAChannel(channelData, audioContext, getState())
          .then((channelInfo) =>  {
            dispatch(addChannel(channelInfo));
            dispatch(updateChannelMarkers(channelInfo));
            }));

        return Promise.all(channelPromises);
      })
}};


export const downloadConfig = (() => {
  return (dispatch, getState) => {
    const config = getConfig(getState());
    downloadTextfile("config.json", JSON.stringify(config));
  }
})
