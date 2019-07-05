import {
  CLEAR_PARTS,
  CREATE_PART,
  UPDATE_PART,
  DELETE_PART,
} from "./types";


export const createPart = (partInfo) => ({
  type: CREATE_PART,
  payload: partInfo,
});

export const updatePart = (partInfo) => ({
  type: UPDATE_PART,
  payload: partInfo,
});

export const deletePart = (partId) => ({
  type: DELETE_PART,
  payload: partId,
});

export const clearParts = channelInfo => ({
  type: CLEAR_PARTS,
  payload: channelInfo,
});
