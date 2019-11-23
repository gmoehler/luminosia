// reducer working on the part entities

import { combineReducers } from "redux";
import { schema, denormalize } from "normalizr";

import {
  CLEAR_PARTS, ADD_PART, DELETE_PART, MOVE_PART, RESIZE_PART, MOVE_PARTS,
} from "../actions/types";
import { cloneDeep } from "lodash";

export const partSchema = new schema.Entity(
  "byPartId",
  {},
  { idAttribute: "partId" }
);

export const initialState = {
  byPartId: {},
  allPartIds: [],
};

// split into 2 reducers: byPartId and allPartIds

const byPartId = (state = {}, action) => {
  switch (action.type) {

    case ADD_PART: {
      return {
        ...state,
        ...action.payload.entities.byPartId, // normalized parts
      };
    }
    case MOVE_PART:
      const part0 = state[action.payload.partId];
      const currentOffset0 = part0.actOffset || part0.offset || 0;
      const partUpdate0 = movePartWithSnap(
        currentOffset0, part0.duration,
        action.payload.incr, action.payload.snapPositions,
        action.payload.snapDist);

      const newPart0 = {
        ...part0,
        ...partUpdate0
      };
      return {
        ...state,
        [action.payload.partId]: newPart0,
      };

    case MOVE_PARTS:
      const incr = getIncrWithSnap(action.payload.partIds, state,
        action.payload.incr, action.payload.snapPositions, action.payload.snapDist);

      // update offset
      // actOffset keeps going independent of snap
      const newByPartId = cloneDeep(state);
      action.payload.partIds.forEach((partId) => {
        const part = state[partId];
        const offset = part.offset + incr;
        const actOffset = (part.actOffset || part.offset) + action.payload.incr;

        newByPartId[part.partId] = {
          ...part,
          offset,
          actOffset,
        };
      });

      return {
        ...newByPartId
      };

    case RESIZE_PART:
      const part1 = state[action.payload.partId];
      const snapDist1 = action.payload.snapDist || 0.2;
      const minDur1 = action.payload.minDuration; // min part duration
      const snapPositions1 = action.payload.snapPositions;
      let newPart1;

      // left part boundary moved
      if (action.payload.bound === "left") {
        const rightBound1 = part1.offset + part1.duration;
        const currentOffset1 = part1.actOffset || part1.offset || 0;
        const actualOffset1 = bound(currentOffset1 + action.payload.incr, 0, rightBound1 - minDur1);
        const snapOffsetLeft1 = snapTo(actualOffset1, snapPositions1, snapDist1);
        const updatedOffset1 = bound(snapOffsetLeft1, 0, rightBound1 - minDur1);

        newPart1 = {
          ...part1,
          offset: updatedOffset1,
          duration: rightBound1 - updatedOffset1,
          actOffset: actualOffset1,
          actRightBound: null,
        };

      } else {
        // right part bound moved
        const rightBound2 = part1.actRightBound || (part1.offset + part1.duration);
        const actualRightBound2 = bound(rightBound2 + action.payload.incr, part1.offset + minDur1, null);
        const snapOffsetRight2 = snapTo(actualRightBound2, snapPositions1, snapDist1);
        const updatedDuration2 = bound(snapOffsetRight2 - part1.offset, minDur1, null);

        newPart1 = {
          ...part1,
          duration: updatedDuration2,
          offset: part1.offset,
          actRightBound: actualRightBound2,
          actOffset: null,
        };
      }

      return {
        ...state,
        [action.payload.partId]: newPart1,
      };

    case DELETE_PART:
      const newState = {
        ...state
      };
      delete newState[action.payload.partId]; // ids
      return newState;

    case CLEAR_PARTS:
      return {};

    default:
      return state;
  }
};

const allPartIds = (state = [], action) => {
  switch (action.type) {

    case ADD_PART:
      return [...state, action.payload.result];

    case DELETE_PART:
      return state.filter(p => p !== action.payload.partId);

    case CLEAR_PARTS:
      return [];

    default:
      return state;
  }
};

export default combineReducers({
  byPartId,
  allPartIds,
});

function getIncrWithSnap(partIdsToMove, partsById, incr, snapPositions, snapDist) {
  // find index of left most and right most part
  const [minId, maxId] = partIdsToMove.reduce(([minId, maxId], partId) => {
    if (minId === null || maxId === null) {
      return [partId, partId];
    }
    const part = partsById[partId];
    if (part.offset < partsById[minId].offset) {
      return [part.partId, maxId];
    }
    if (part.offset + part.duration > partsById[minId].offset + partsById[minId].duration) {
      return [minId, part.partId];
    }
    return [minId, maxId];
  }, [null, null]);

  const updatedOffset = (partsById[minId].actOffset || partsById[minId].offset) + incr;
  let updatedIncr = incr;
  // potentially snap left to next snap position
  const snapOffsetLeft = snapTo(updatedOffset, snapPositions, snapDist);
  if (snapOffsetLeft !== updatedOffset) {
    // ok we snapped to the left, recalc incr
    updatedIncr = snapOffsetLeft - partsById[minId].offset;
  } else {
    // try to snap at the right
    const updatedOffsetRight = (partsById[maxId].actOffset || partsById[maxId].offset)
      + partsById[maxId].duration + incr;
    const snapOffsetRight = snapTo(updatedOffsetRight, snapPositions, snapDist);
    updatedIncr = snapOffsetRight - (partsById[maxId].offset + partsById[maxId].duration);
  }

  if (partsById[minId].offset + updatedIncr < 0) {
    updatedIncr = 0;
  }

  return updatedIncr;
}

function movePartWithSnap(offset, duration, incr, snapPositions, snapDist) {
  // actOffset is the actuall offset without snap
  const updatedOffset = offset + incr;

  // potentially snap left to next snap position
  const snapOffsetLeft = snapTo(updatedOffset, snapPositions, snapDist);
  // only snap right when left was not snapped yet
  const snapOffsetRight = (snapOffsetLeft === updatedOffset)
    ? snapTo(updatedOffset + duration, snapPositions, snapDist)
    : snapOffsetLeft + duration;

  return {
    offset: snapOffsetRight - duration,
    duration,
    actOffset: updatedOffset,
    actRightBound: null,
  };
}

function bound(val, leftBound, rightBound) {
  let left = leftBound;
  if (rightBound) {
    const right = Math.max(leftBound, rightBound);
    left = Math.min(leftBound, rightBound);
    if (val > right) {
      return right;
    }
  }

  return Math.max(val, left);
}

function snapTo(posToSnap, snapPositions, maxDist) {
  const snapDiffLeft = closestSnapDiff(posToSnap, snapPositions);
  if (Number.isInteger(snapDiffLeft.idx) && snapDiffLeft.diff < maxDist) {
    return snapPositions[snapDiffLeft.idx]; // snap
  }
  return posToSnap;
}

// export for testing only
export function closestSnapDiff(myPos, positions) {
  const diffs = positions ? positions
    .map((pos) => Math.abs(pos - myPos)) : [];
  const idx = diffs
    .reduce((iMin, val, i, dif) =>
      (Number.isInteger(iMin) && val >= dif[iMin]) ? iMin : i, null);

  if (Number.isInteger(idx)) {
    return {
      idx,
      diff: diffs[idx]
    };
  }
  return {
    idx,
    diff: null
  };

}

export function partExists(state, partId) {
  return state.entities.parts.allPartIds.includes(partId);
}

export function getPart(state, partId) {
  return state.entities.parts.byPartId[partId];
}

export function getParts(state, partIds) {
  return denormalize(partIds, [partSchema], state.entities.parts);
}

export function getAllPartIds(state) {
  return state.entities.parts.allPartIds;
}

export function getChannelId(state, partId) {
  if (!partExists(state, partId)) {
    return null;
  }
  return getPart(state, partId).channelId;
}

export const getPartIdsInInterval = (state, channelId, from, to) => {
  // from channel only
  // const partIds = getPartIdsInChannel(state, channelId);
  // or all parts
  const partIds = getAllPartIds(state);
  const parts = getParts(state, partIds);
  return parts
    .filter(
      part => part.offset + part.duration < to && part.offset > from)
    .map(part => part.partId);
};