
import { normalize } from "normalizr";
import {
  CLEAR_PARTS, ADD_A_PART, DELETE_A_PART, RESIZE_A_PART, MOVE_A_PART,
} from "./types";
import {
  getChannelId, partSchema, getPart
} from "../reducers/partReducer";
import { syncPartMarkers } from "./markerActions";

import { toggleEntitySelection } from "./entityActions";
import { isEntitySelected, getSelectedEntitiesOfType } from "../reducers/entityReducer";

// first id will be 1 to avoid falsy ids
let lastPartIdCount = 0;

function generateId() {
  // simple generator :-)
  // other options: cuid or uuid
  lastPartIdCount++;
  return "part-" + lastPartIdCount.toString();
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
      dispatch(toggleEntitySelection(partId));
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
    } else {
      console.error("cannot remove non-existing part:", partId);
    }
  };
};

const _deletePart = (partIdAndChannelId) => ({
  type: DELETE_A_PART,
  // no normalization should not be required since we can achieve this with partId and channelId alone
  payload: partIdAndChannelId,
});

export const clearParts = () => ({
  type: CLEAR_PARTS
});

export const moveAPart = (moveInfo) => {
  return (dispatch, getState) => {

    // ensure we have what we need
    // so reducers do not need to check assumptions
    if (moveInfo.partId) {
      // if incr is 0 no need to move
      if (moveInfo.incr) {
        dispatch(_movePart(moveInfo));
        // update markers based on actual move
        dispatch(syncPartDeps(moveInfo.partId));
      }
    } else {
      console.error("part does not have enough information to be moved:", moveInfo);
    }
  };
};

export const moveSelectedParts = (moveInfo) => {
  return (dispatch, getState) => {
    if (!isEntitySelected(getState(), moveInfo.partId)) {
      // if part was not selected then exclusively select it for move
      dispatch(toggleEntitySelection(moveInfo.partId));
    }
    getSelectedEntitiesOfType(getState(), "part").forEach((partId) => {
      dispatch(moveAPart({
        partId,
        incr: moveInfo.incr,
      }));
    });
  };
};

const _movePart = (moveInfo) => ({
  type: MOVE_A_PART,
  payload: moveInfo
});

export const resizeAPart = (resizeInfo) => {
  return (dispatch, getState) => {

    // ensure we have what we need
    // so reducers do not need to check assumptions
    if (resizeInfo.partId && resizeInfo.markerId) {
      // exclusively select this part
      dispatch(toggleEntitySelection(resizeInfo.partId));
      // if incr is 0 no need to resize
      if (resizeInfo.incr) {
        resizeInfo.bound = resizeInfo.markerId.includes("right") ? "right" : "left";
        dispatch(_resizePart(resizeInfo));
        // update markers based on actual resize
        dispatch(syncPartDeps(resizeInfo.partId));
      }
    } else {
      console.error("part does not have enough information to be resized:",
        resizeInfo);
    }
  };
};

const _resizePart = (resizeInfo) => ({
  type: RESIZE_A_PART,
  payload: resizeInfo
});

export const syncPartDeps = (partId) => {
  return (dispatch, getState) => {
    const part = getPart(getState(), partId);
    if (part) {
      // currently only part markers need to be synced
      dispatch(syncPartMarkers(part));
    } else {
      console.error("part to sync deps for does not exist:", partId);
    }
  };
};