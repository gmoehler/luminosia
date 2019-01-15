import { CLEAR_IMAGELIST, ADD_IMAGE, REMOVE_IMAGE, LOAD_IMAGELIST_STARTED, LOAD_IMAGELIST_SUCCESS, LOAD_IMAGELIST_FAILURE } from '../actions/types';

const initialState = {
  byId: {},
};

export default (state = initialState, action) => {
  switch (action.type) {

    case CLEAR_IMAGELIST:
      return initialState;

    case ADD_IMAGE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.src]: action.payload
        }
      };

    case REMOVE_IMAGE:
      return {
        ...state,
        byId: {
          ...state.byId
            .filter((img) => img.src !== action.src)
        }
      };

    case LOAD_IMAGELIST_STARTED:
      return {
        ...state,
        loading: true
      };

    case LOAD_IMAGELIST_SUCCESS:
      return {
        ...state,
        loading: false,
        byId: action.payload.normalizedImages
      };

    case LOAD_IMAGELIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
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

// array of all images with certain fields filtered out
// to get essential parts for config download
export const getImageListConfig = (state) => {
  const allowedProps = ["src"];
  const images = state.images.byId ? Object.values(state.images.byId) : [];
  return images.map((ch) => 
    Object.keys(ch)
      .filter(key => allowedProps.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: ch[key]
        };
      }, {}))
    };

