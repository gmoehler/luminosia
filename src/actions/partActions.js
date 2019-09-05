
import { normalize } from "normalizr";
import { CLEAR_PARTS, ADD_A_PART, DELETE_A_PART } from "./types";
import { getChannelId, partSchema } from "../reducers/partReducer";

// first id will be 1 to avoid falsy ids
let lastPartId = 0;

function generateId() {
  // simple generator :-)
  // other options: cuid or uuid
  lastPartId++;
  return "part-" + lastPartId.toString();
}

// create part id and add the part to the parts entities and channel
// returns the new part id
export const createPart = (partInfo) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions
    // TODO: remove channelId number checking once channel ids are strings
    if (partInfo.imageId && partInfo.channelId != null
      && partInfo.offset != null && partInfo.duration != null) {

      const partId = generateId();
      // add part with new part id
      dispatch(_addPart({
        ...partInfo,
        partId,
      }));
      // const bla = normalize(partInfo, partSchema);
      return partId;
    }
    console.error("cannot add incomplete part:", partInfo);
    return null;
  };
};

const _addPart = (partInfo) => ({
  type: ADD_A_PART,
  // normalize for easy usage in partReducer
  // also add channelId for channelReducer
  payload: {
    ...normalize(partInfo, partSchema),
    channelId: partInfo.channelId
  }
});

export const deleteAPart = (partId) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions
    // TODO: remove channelId number checking once channel ids are strings
    const channelId = getChannelId(getState(), partId);

    if (partId && channelId != null) {
      dispatch(_deletePart({
        partId,
        channelId
      }));
    }
    console.error("cannot remove non-existing part:", partId);
    return null;
  };
};

const _deletePart = (partIdAndChannelId) => ({
  type: DELETE_A_PART,
  // no normalization should be required since we can achieve this with partId and channelId alone
  payload: partIdAndChannelId,
});

export const clearParts = () => ({
  type: CLEAR_PARTS
});
