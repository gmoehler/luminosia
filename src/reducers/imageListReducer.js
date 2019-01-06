import {ADD_IMAGE, REMOVE_IMAGE} from '../actions/types';

const initialState = {
  imagesById: {},
};

export default(state = initialState, action) => {
  switch (action.type) {

    case ADD_IMAGE:
      return {
        ...state,
        imagesById: {
          ...state.imagesById,
          [action.payload.src] : action.payload
        }
      };

    case REMOVE_IMAGE:
    return {
      ...state,
      imagesById: {
        ...state.imagesById
          .filter((img) => img.src !== action.src)
      }
    };

    default:
      return state
  }
}

export const getImageList = (state) => {
  return state.images.imagesById ? Object.values(state.images.imagesById) : [];
}