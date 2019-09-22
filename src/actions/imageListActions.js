import { ADD_IMAGE, CLEAR_IMAGELIST, REMOVE_IMAGE, SELECT_IMAGE, DESELECT_IMAGE, CLEAR_IMAGE_SELECTION } from "./types";
import { getImageList, imageExists } from "../reducers/imageListReducer";

const _addImage = (imageInfo) => ({
  type: ADD_IMAGE,
  payload: imageInfo
});

export function addImage(imageInfo) {
  return (dispatch, getState) => {
    // required fields
    if ((imageInfo.filename || imageInfo.imageId) &&
      imageInfo.src && imageInfo.width && imageInfo.height) {
      // add imageId based on filename
      const imageId = imageInfo.imageId || imageInfo.filename;
      // only insert once
      if (!imageExists(getState(), imageId)) {
        dispatch(_addImage({
          ...imageInfo,
          imageId
        }));
        return imageId;
      }
    }
    return null;
  };
};

export const clearImageList = () => ({
  type: CLEAR_IMAGELIST
});

const _removeImage = (imageId) => ({
  type: REMOVE_IMAGE,
  payload: imageId
});

export function removeImage(imageId) {
  return (dispatch, getState) => {
    if (imageExists(getState(), imageId)) {
      dispatch(_removeImage(imageId));
    }
  };
};

export const selectImage = (imageId) => {
  return (dispatch, getState) => {
    // ensure that image exists
    if (imageExists(getState(), imageId)) {
      dispatch(_selectImage(imageId));
    } else {
      console.error("image to select does not exist:", imageId);
    }
  };
};

const _selectImage = (imageId) => ({
  type: SELECT_IMAGE,
  payload: imageId
});

export const deselectImage = (imageId) => {
  return (dispatch, getState) => {
    // ensure that image exists
    if (imageExists(getState(), imageId)) {
      dispatch(_deselectPart(imageId));
    } else {
      console.error("part to deselect does not exist:", imageId);
    }
  };
};

const _deselectPart = (partId) => ({
  type: DESELECT_IMAGE,
  payload: partId
});

export const clearSelection = () => ({
  type: CLEAR_IMAGE_SELECTION
});

/**************************************/
/******* LOAD / 'STORE ACTIONS ********/
/**************************************/

export function loadImage(imageInfo) {
  // base64 encoded images
  if (imageInfo.src.startsWith("data:image")) {
    // we assume everything is in the record
    return Promise.resolve(imageInfo);
  }
  // no longer read file from server
}

export function saveImageToStorage(image) {
  const key = "image_" + image.imageId;
  const imageStr = JSON.stringify(image);
  localStorage.setItem(key, imageStr);
}

export function saveImagesToStorage(image) {
  return (dispatch, getState) => {
    const images = getImageList(getState());
    images.forEach((img) => saveImageToStorage(img));
  };
}

// load images from localstorage and add them to the store
export function loadImagesFromStorage() {
  return (dispatch, getState) => {
    return Object.keys(localStorage)
      .filter((k) => k.startsWith("image_"))
      .reduce((res, key) => {
        const img = JSON.parse(localStorage.getItem(key));
        res.push(img);
        return res;
      }, [])
      .forEach((img) => dispatch(addImage(img)));
  };
}

export function clearImagesfromStorage() {
  return (dispatch, getState) => {
    return Object.keys(localStorage)
      .filter((k) => k.startsWith("image_"))
      .forEach((img) => localStorage.removeItem(img));
  };
}