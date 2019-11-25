
import { normalize } from "normalizr";
import {
  CLEAR_PARTS, ADD_PART, DELETE_PART, RESIZE_PART, MOVE_PART, MOVE_PARTS,
} from "./types";
import { getChannelId, partSchema, getPart, getPartIdsInInterval } from "../reducers/partReducer";
import { syncPartMarkers, deletePartSelectionMarkers } from "./markerActions";

import { toggleEntitySelection, selectEntity } from "./entityActions";
import { isEntitySelected, getSelectedEntityIdsOfType } from "../reducers/entityReducer";
import { getAllMarkerPosOfType } from "../reducers/markerReducer";
import { getChannelSnapDist, getChannelMinPartDuration } from "../reducers/channelReducer";
import { getSnapToMarkers } from "../reducers/viewReducer";

// first id will be 1 to avoid falsy ids
let lastPartIdCount = 0;

// should only be used with care (e.g. in tests)
export function _setInitialPartIdCount(newId) {
  lastPartIdCount = newId;
}

function generateId() {
  // simple generator :-)
  // other options: cuid or uuid
  lastPartIdCount++;
  return "part-" + lastPartIdCount.toString();
}

const _addPart = (partInfo) => ({
  type: ADD_PART,
  // normalize for easy usage in partReducer
  // also add channelId for channelReducer
  payload: {
    ...normalize(partInfo, partSchema),
  }
});

// create part id and add the part to the parts entities and channel
// and conditionally selects new part
// returns the new part id 
export const createPart = (partInfo, selectNewPart = true) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions
    if (partInfo.imageId && partInfo.channelId != null
      && partInfo.offset != null && partInfo.duration != null) {

      const partId = generateId();
      // add part with new part id
      dispatch(_addPart({
        ...partInfo,
        partId,
      }));
      if (selectNewPart) {
        dispatch(toggleEntitySelection(partId));
      }
      return partId;
    }
    console.error("cannot add incomplete part:", partInfo);
    return null;
  };
};



const _deletePart = (partIdAndChannelId) => ({
  type: DELETE_PART,
  // no normalization should not be required since we can achieve this with partId and channelId alone
  payload: partIdAndChannelId,
});

export const deletePart = (partId) => {
  return (dispatch, getState) => {
    // ensure we have what we need
    // so reducers do not need to check assumptions
    const channelId = getChannelId(getState(), partId);

    if (partId && channelId != null) {
      dispatch(_deletePart({
        partId,
        channelId
      }));
      // in case it is selected:
      dispatch(deletePartSelectionMarkers(partId));
    } else {
      console.error("cannot remove non-existing part:", partId);
    }
  };
};

export const clearParts = () => ({
  type: CLEAR_PARTS
});

const _movePart = (moveInfo, snapPositions, snapDist) => ({
  type: MOVE_PART,
  payload: {
    ...moveInfo,
    snapPositions,
    snapDist,
  }
});

// move part with snapping to markers
export const movePart = (moveInfo) => {
  return (dispatch, getState) => {

    // ensure we have what we need
    // so reducers do not need to check assumptions
    if (moveInfo.partId) {
      // if incr is 0 no need to move
      if (moveInfo.incr) {

        let markerPositions = [];
        let snapDist = null;
        const withSnap = getSnapToMarkers(getState());
        if (withSnap) {
          // all markers are snap positions for start / end of part
          // TODO: cache markers for one move operation
          markerPositions = getAllMarkerPosOfType(getState(), "timeScale");
          const channelId = getChannelId(getState(), moveInfo.partId);
          snapDist = getChannelSnapDist(getState(), channelId);
        }
        dispatch(_movePart(moveInfo, markerPositions, snapDist));
        // update markers based on actual move
        dispatch(syncPartDeps(moveInfo.partId));
      }
    } else {
      console.error("part does not have enough information to be moved:", moveInfo);
    }
  };
};

const _moveParts = (partIds, incr, snapPositions, snapDist) => ({
  type: MOVE_PARTS,
  payload: {
    partIds,
    incr,
    snapPositions,
    snapDist,
  }
});

// move selected parts and snap
export const moveSelectedParts = (moveInfo) => {
  return (dispatch, getState) => {
    if (!isEntitySelected(getState(), moveInfo.partId)) {
      // if part was not selected then exclusively select it for move
      dispatch(toggleEntitySelection(moveInfo.partId));
    }

    if (moveInfo.incr) {
      const partIdsToMove = getSelectedEntityIdsOfType(getState(), "part");

      let markerPositions = [];
      let snapDist = null;
      const withSnap = getSnapToMarkers(getState());
      if (withSnap) {
        // all markers are snap positions for start / end of part
        // TODO: cache markers for one move operation
        markerPositions = getAllMarkerPosOfType(getState(), "timeScale");
        const channelId = getChannelId(getState(), moveInfo.partId);
        snapDist = getChannelSnapDist(getState(), channelId);
      }
      dispatch(_moveParts(partIdsToMove, moveInfo.incr, markerPositions, snapDist));
      partIdsToMove.forEach((partId) =>
        dispatch(syncPartDeps(partId)));
    }
  };
};

const _resizePart = (resizeInfo, snapPositions, snapDist, minDuration) => ({
  type: RESIZE_PART,
  payload: {
    ...resizeInfo,
    snapPositions,
    snapDist,
    minDuration,
  }
});

export const resizePart = (resizeInfo) => {
  return (dispatch, getState) => {

    // ensure we have what we need
    // so reducers do not need to check assumptions
    if (resizeInfo.partId && resizeInfo.markerId) {
      // exclusively select this part
      dispatch(toggleEntitySelection(resizeInfo.partId));
      // if incr is 0 no need to resize
      if (resizeInfo.incr) {
        const channelId = getChannelId(getState(), resizeInfo.partId);
        resizeInfo.bound = resizeInfo.markerId.includes("right") ? "right" : "left";

        let markerPositions = [];
        let snapDist = null;
        const minDuration = getChannelMinPartDuration(getState(), channelId);
        const withSnap = getSnapToMarkers(getState());
        if (withSnap) {
          // all markers are snap positions for start / end of part
          // TODO: cache markers for one move operation
          markerPositions = getAllMarkerPosOfType(getState(), "timeScale");
          snapDist = getChannelSnapDist(getState(), channelId);
        }
        dispatch(_resizePart(resizeInfo, markerPositions, snapDist, minDuration));
        // update markers based on actual resize
        dispatch(syncPartDeps(resizeInfo.partId));
      }
    } else {
      console.error("part does not have enough information to be resized:",
        resizeInfo);
    }
  };
};

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


export const selectInInterval = ((selectedChannelId, from, to) => {
  return (dispatch, getState) => {
    const partIds = getPartIdsInInterval(getState(), selectedChannelId, from, to);
    partIds.forEach((pId) => dispatch(selectEntity(pId)));
  };
});
