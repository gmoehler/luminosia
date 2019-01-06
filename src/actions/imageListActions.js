import { ADD_IMAGE, REMOVE_IMAGE } from './types';

// load audio async action


export const addImage = (imageInfo) => ({
  type: ADD_IMAGE,
  payload: imageInfo
});

export const removeImage = (imageInfo) => ({
  type: REMOVE_IMAGE,
  payload: imageInfo
});
