import { ADD_IMAGE, REMOVE_IMAGE, LOAD_IMAGELIST_STARTED, LOAD_IMAGELIST_SUCCESS, LOAD_IMAGELIST_FAILURE } from '../actions/types';

const initialState = {
  byId: {},
};

export default (state = initialState, action) => {
  switch (action.type) {

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