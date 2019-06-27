import { cloneDeep } from "lodash";
import { CLEAR_IMAGELIST, ADD_IMAGE, REMOVE_IMAGE, } from "../actions/types";
import { filterObjectByKeys } from "../utils/miscUtils";

const initialState = {
  byImageId: {},
};

export default (state = initialState, action) => {
  switch (action.type) {

    case CLEAR_IMAGELIST:
      return initialState;

    case ADD_IMAGE:
      const imageId = action.payload.imageId ? action.payload.imageId : action.payload.src;
      return {
        ...state,
        byImageId: {
          ...state.byImageId,
          [imageId]: action.payload
        }
      };

    case REMOVE_IMAGE:
      const images = cloneDeep(state).byImageId;
      delete images[action.payload.imageId];

      return {
        ...state,
        byImageId: images
      };

    default:
      return state;
  }
};

export const getImageList = (state) => {
  return Object.values(state.images.byImageId);
};

// an map with imageIds pointing to image sources
export const getImageSources = (state) => {
  const ret = Object.values(state.images.byImageId).reduce((srcMap, img) => {
      srcMap[img.imageId] = img.src;
      return srcMap;
  }, {});
    return ret;
};

export const getImageSampleRate = (state) => {
  return state.images.sampleRate;
};

export const getImageDuration = (state, imageId) => {
  const img = state.images.byImageId[imageId];
  return img ? img.duration : 0;
};

// array of all images with relevant fields filtered out
export const getImageListConfig = (state) => {
  const allowedProps = ["src", "sampleRate",
    "imageId", "width", "height", "duration"];

  const images = state.images.byImageId ?
    Object.values(state.images.byImageId) : [];

  return images.map((img) => filterObjectByKeys(img, allowedProps));

};

export const imageExists = 
	(state, id) => Object.keys(state.images.byImageId).includes(id);
