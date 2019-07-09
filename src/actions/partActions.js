import { CLEAR_PARTS, ADD_NEW_PART, UPDATE_PART, DELETE_PART,
} from "./types";

// first id will be 1 to avoid falsy ids
let lastId = 0;

function generateId() {
  // simple generator :-)
  // other options cuid or uuid
  lastId++;
  return lastId.toString();
}

export const createPart = (partInfo) => {
  return (dispatch, getState) => {
    dispatch(addPart({
      ...partInfo,
      partId: generateId()
    }));
  };
};

const addPart = (partInfo) => ({
  type: ADD_NEW_PART,
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
