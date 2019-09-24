import { cloneDeep } from "lodash";
import { CLEAR_IMAGELIST, ADD_IMAGE, REMOVE_IMAGE, SELECT_IMAGE, DESELECT_IMAGE, CLEAR_IMAGE_SELECTION, } from "../actions/types";
import { filterObjectByKeys } from "../utils/miscUtils";
import { combineReducers } from "redux";

export const initialState = {
  byImageId: {},
  allImageIds: [],
  selectedImageIds: [],
};

const byImageId = (state = {}, action) => {
  switch (action.type) {

    case CLEAR_IMAGELIST:
      return {};

    case ADD_IMAGE:
      return {
        ...state,
        [action.payload.imageId]: action.payload
      };

    case REMOVE_IMAGE:
      const newByImageId = cloneDeep(state);
      delete newByImageId[action.payload];
      return newByImageId;

    default:
      return state;
  }
};

const allImageIds = (state = [], action) => {
  switch (action.type) {

    case CLEAR_IMAGELIST:
      return [];

    case ADD_IMAGE:
      // we already ensured in the action that it did not yet exist
      return [...state, action.payload.imageId];

    case REMOVE_IMAGE:
      return state.filter(p => p !== action.payload);

    default:
      return state;
  }
};

const selectedImageIds = (state = [], action) => {
  switch (action.type) {

    case REMOVE_IMAGE:
      return state.filter(p => p !== action.payload);

    case SELECT_IMAGE:
      return [...state, action.payload];

    case DESELECT_IMAGE:
      return state.filter(p => p !== action.payload);

    case CLEAR_IMAGELIST:
    case CLEAR_IMAGE_SELECTION:
      return [];

    default:
      return state;
  }
};

export default combineReducers({
  byImageId,
  allImageIds,
  selectedImageIds,
});

export const getImageList = (state) => {
  return Object.values(state.entities.images.byImageId);
};

// an map with imageIds pointing to image sources
// TODO: think about denorm with image sources or lookup func
export const getImageSources = (state) => {
  const ret = Object.values(state.entities.images.byImageId).reduce((srcMap, img) => {
    srcMap[img.imageId] = img.src;
    return srcMap;
  }, {});
  return ret;
};

// TODO: move sample rate to part
export const getImageSampleRate = (state) => {
  return state.entities.images.sampleRate;
};

// TODO: move image duration to part
export const getImageDuration = (state, imageId) => {
  const img = state.entities.images.byImageId[imageId];
  return img ? img.duration : 0;
};

// array of all images with relevant fields only
export const getImageListConfig = (state) => {
  const allowedProps = ["imageId",
    "filename", "src",
    "width", "height",
    "sampleRate", "duration"];

  const images = state.entities.images.byImageId ?
    Object.values(state.entities.images.byImageId) : [];

  return images.map((img) => filterObjectByKeys(img, allowedProps));
};

export const imageExists = (state, id) =>
  state.entities.images.allImageIds.includes(id);

export function isImageSelected(state, imageId) {
  return state.entities.images.selectedImageIds.includes(imageId);
}

export function isImageSingleSelected(state, imageId) {
  return state.entities.images.selectedImageIds === [imageId];
}