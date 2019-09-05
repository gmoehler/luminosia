import { cloneDeep } from "lodash";
import { CLEAR_IMAGELIST, ADD_IMAGE, REMOVE_IMAGE, } from "../actions/types";
import { filterObjectByKeys } from "../utils/miscUtils";
import { combineReducers } from "redux";

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
      const newImages = cloneDeep(state).byImageId;
      delete newImages[action.payload.imageId];
      return newImages;

    default:
      return state;
  }
};

const allImageIds = (state = [], action) => {
  switch (action.type) {

    case CLEAR_IMAGELIST:
      return [];

    case ADD_IMAGE:
      return [...state, action.payload.imageId];

    case REMOVE_IMAGE:
      const newAllImageIds = [...state];
      newAllImageIds.splice(state.indexOf(action.payload.imageId), 1); // ids
      return newAllImageIds;

    default:
      return state;
  }
};

export default combineReducers({
  byImageId,
  allImageIds,
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

export const getImageSampleRate = (state) => {
  return state.entities.images.sampleRate;
};

export const getImageDuration = (state, imageId) => {
  const img = state.entities.images.byImageId[imageId];
  return img ? img.duration : 0;
};

// array of all images with relevant fields filtered out
export const getImageListConfig = (state) => {
  const allowedProps = ["src", "sampleRate",
    "imageId", "width", "height", "duration"];

  const images = state.entities.images.byImageId ?
    Object.values(state.entities.images.byImageId) : [];

  return images.map((img) => filterObjectByKeys(img, allowedProps));
};

export const imageExists =
  (state, id) => Object.keys(state.entities.images.byImageId).includes(id);
