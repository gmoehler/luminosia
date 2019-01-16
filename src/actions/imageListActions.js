import LoaderFactory from '../loader/LoaderFactory'

import { ADD_IMAGE, CLEAR_IMAGELIST, REMOVE_IMAGE, LOAD_IMAGELIST_STARTED, LOAD_IMAGELIST_SUCCESS, LOAD_IMAGELIST_FAILURE } from './types';
import { samplesToSeconds } from '../utils/conversions';


export const addImage = (imageInfo) => ({
  type: ADD_IMAGE,
  payload: imageInfo
});

export const clearImageList = () => ({
  type: CLEAR_IMAGELIST
});

export const removeImage = (imageInfo) => ({
  type: REMOVE_IMAGE,
  payload: imageInfo
});

const loadImageListStarted = () => ({
  type: LOAD_IMAGELIST_STARTED
});

const loadImageListSuccess = imageListInfo => ({
  type: LOAD_IMAGELIST_SUCCESS,
  payload: imageListInfo
});

const loadImageListFailure = errorInfo => ({
  type: LOAD_IMAGELIST_FAILURE,
  payload: errorInfo
});

function loadImageFromFile(imageSrc) {
  const loader = LoaderFactory.createLoader(imageSrc);
  return loader.load();
};

export function loadImage(imageInfo) {
  return loadImageFromFile(imageInfo.src)
  .then((img) => {
    img.sampleRate = imageInfo.sampleRate;
    img.duration = samplesToSeconds(img.width, imageInfo.sampleRate);
    return img
  });
}

export const loadImageList = (({images, sampleRate}) => (dispatch) => {
  dispatch(loadImageListStarted());

  const loadImagesPromises = images
    .map((fileConfig) => loadImageFromFile(fileConfig.src));


  return Promise.all(loadImagesPromises)
    .then((imageBuffers) => {

      const normalizedImages = {};
      imageBuffers.forEach((img) => {
        img.sampleRate = sampleRate;
        img.duration = samplesToSeconds(img.width, sampleRate)
        normalizedImages[img.src] = img;

      })

      dispatch(loadImageListSuccess({
        normalizedImages
      }));
    })

    .catch(err => {
      dispatch(loadImageListFailure({
        err
      }));
    });
});


