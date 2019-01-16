import LoaderFactory from '../loader/LoaderFactory'

import { ADD_IMAGE, CLEAR_IMAGELIST, REMOVE_IMAGE } from './types';
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


