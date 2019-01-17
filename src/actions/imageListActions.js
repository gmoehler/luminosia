import LoaderFactory from '../loader/LoaderFactory'

import { ADD_IMAGE, CLEAR_IMAGELIST, REMOVE_IMAGE } from './types';
import { samplesToSeconds } from '../utils/conversions';
import { filterObjectByKeys } from '../utils/miscUtils';
import { defaultSampleRate } from '../components/ImageListContainer';


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
  // base64 encoded images
  if (imageInfo.src.startsWith("data:image")) {
    // we assume everything is in the record
	return Promise.resolve(imageInfo);
  }
  // read file from server
  return loadImageFromFile(imageInfo.src)
  .then((img) => {
    const keys = ["src", "data", "width", "height"];
    const basicImage = filterObjectByKeys (img, keys);
    basicImage.sampleRate = imageInfo.sampleRate ? imageInfo.sampleRate : defaultSampleRate;
    basicImage.duration = samplesToSeconds(img.width, imageInfo.sampleRate);
    basicImage.id = basicImage.src;
    return basicImage;
  });
}

export function saveImageToStorage(image) {
  return (dispatch, getState) => {
    const key = "image_" + image.id;
    const imageStr = JSON.stringify(image);
    localStorage.setItem(key, imageStr);
  }
}

// load images from localstorage and add them to the store
export function loadImagesfromStorage() {
	return (dispatch, getState) => {
		return Object.keys(localStorage)
		  .filter((k) => k.startsWith("image_"))
		  .reduce((res, key) => 
			res.push(localStorage.getItem(key)), [])
			  .forEach((img) =>
				dispatch(addImage(img)));
  }
}