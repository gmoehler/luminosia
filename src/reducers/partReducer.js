// reducer working on the part entities

import { combineReducers } from "redux";
import { schema, denormalize } from "normalizr";

import {
  CLEAR_PARTS, ADD_PART, DELETE_PART, MOVE_PART, RESIZE_PART,
} from "../actions/types";

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
      const part0 = state[action.payload.part.partId];
      const snapPositions0 = action.payload.snapPositions;
      // actOffset is the actuall offset without snap
      const currentOffset0 = part0.actOffset || part0.offset || 0;
      const offsetIncr0 = action.payload.part.incr;
      const updatedOffset0 = currentOffset0 + offsetIncr0;
      const maxDist0 = action.payload.maxDist || 0.2;
      const newPart0 = {
        ...part0,
        ...snapTo(updatedOffset0, part0.duration, snapPositions0, maxDist0)
      };
      return {
        ...state,
        [action.payload.part.partId]: newPart0,
      };

    case RESIZE_PART:
      const part1 = state[action.payload.partId];
      const currentOffset1 = part1.offset || 0;

      let updatedOffset1 = currentOffset1;
      let updatedDuration1 = part1.duration;

      // left part boundary moved
      // between 0 and right boundary
      if (action.payload.bound === "left") {
        const maxOffset = part1.offset + part1.duration;

        // moving right: cannot exceed right end of part
        if (action.payload.incr > 0) {
          updatedDuration1 = Math.max(0, updatedDuration1 - action.payload.incr);
          if (updatedDuration1 === 0) { // never allow duration 0
            updatedDuration1 = part1.duration;
          }
          updatedOffset1 = maxOffset - updatedDuration1;
        } else { // move left: cannot be left of 0
          updatedOffset1 = Math.max(0, updatedOffset1 + action.payload.incr);
          updatedDuration1 = maxOffset - updatedOffset1;
        }

        // right boundary moved 
        // right to the start of part 
      } else {
        updatedDuration1 = Math.max(0, updatedDuration1 + action.payload.incr);
        if (updatedDuration1 === 0) { // never allow duration 0
          updatedDuration1 = part1.duration;
        }
      }

      const newPart1 = {
        ...part1,
        duration: updatedDuration1,
        offset: updatedOffset1,
      };

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

function snapTo(myPos, myDur, snapPositions, maxDist) {
  // snap to part begin
  const snapDiffLeft = closestSnapDiff(myPos, snapPositions);
  if (Number.isInteger(snapDiffLeft.idx) && snapDiffLeft.diff < maxDist) {
    return {
      offset: snapPositions[snapDiffLeft.idx],
      actOffset: myPos,
    };
  }

  // snap to part end
  const snapDiffRight = closestSnapDiff(myPos + myDur, snapPositions);
  if (Number.isInteger(snapDiffRight.idx) && snapDiffRight.diff < maxDist) {
    return {
      offset: snapPositions[snapDiffRight.idx] - myDur,
      actOffset: myPos,
    };
  }

  // no snap
  return {
    offset: myPos,
    actOffset: myPos,
  };
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