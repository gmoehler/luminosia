import { cloneDeep } from 'lodash';
import { CLEAR_IMAGELIST, ADD_IMAGE, REMOVE_IMAGE, } from '../actions/types';
import { filterObjectByKeys } from '../utils/miscUtils';

const initialState = {
  byId: {},
};

export default (state = initialState, action) => {
  switch (action.type) {

    case CLEAR_IMAGELIST:
      return initialState;

    case ADD_IMAGE:
      const id = action.payload.id ? action.payload.id : action.payload.src;
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: action.payload
        }
      };

    case REMOVE_IMAGE:
      const images = cloneDeep(state).byId;
      delete images[action.payload.imageId];

      return {
        ...state,
        byId: images
      };

    default:
      return state
  }
}

export const getImageList = (state) => {
  return state.images.byId ? Object.values(state.images.byId) : [];
}

export const getImageSampleRate = (state) => {
  return state.images.sampleRate;
}

export const getImageDuration = (state, id) => {
  const img = state.images.byId[id];
  return img ? img.duration : 0;
}

// array of all images with relevant fields filtered out
export const getImageListConfig = (state) => {
  const allowedProps = ["src", "sampleRate", 
    "id", "width", "height", "duration"];
  
  const images = state.images.byId ? 
    Object.values(state.images.byId) : [];
  
  return images.map((img) => 
    filterObjectByKeys(img, allowedProps));

};
