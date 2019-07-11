import {
  CLEAR_PARTS, ADD_A_PART, DELETE_A_PART, MOVE_A_PART, RESIZE_A_PART
} from "../actions/types";


export const initialState = {
  byPartId: {},
  allPartIds: []
};

// currently no assumptions are made for the fields in part

export default (state = initialState, action) => {
  switch (action.type) {

    case ADD_A_PART:
      // it is ensured that partId exists and is new -> not checking it
      return {
        ...state,

        // add to byPartId
        byPartId: {
          ...state.byPartId,
          [action.payload.partId]: action.payload
        },

        // add id to allPartIds
        allPartIds: [
          ...state.allPartIds,
          action.payload.partId,
        ],
      };

    case MOVE_A_PART:
      const part0 = state.byPartId[action.payload.partId];
      const currentOffset0 = part0.offset || 0;
      const offsetIncr0 = action.payload.incr || 0;
      const updatedOffset0 = currentOffset0 + offsetIncr0;
      const newPart0 = {
        ...part0,
        offset: Math.max(0, updatedOffset0),
      };
      return {
        ...state,
        byPartId: {
          ...state.byPartId,
          [action.payload.partId]: newPart0,
        },
        // unchanged allPartIds
      };

    case RESIZE_A_PART:
      const part1 = state.byPartId[action.payload.partId];
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
        byPartId: {
          ...state.byPartId,
          [action.payload.partId]: newPart1,
        },
        // unchanged allPartIds
      };

    case DELETE_A_PART:
      // it is ensured that partId is not null and part is existing
      // remove from byPartId
      const nextByPartId = {
        ...state.byPartId
      };
      delete nextByPartId[action.payload.partId];
      return {
        ...state,
        byPartId: nextByPartId,
        // remove id from allPartIds
        allPartIds: [
          ...state.allPartIds.filter(id => id !== action.payload.partId)],
      };

    case CLEAR_PARTS:
      return initialState;

    default:
      return state;

  }
};

export function doesPartExist(state, partId) {
  return state.entities.parts.allPartIds.includes(partId);
}

export function getChannelId(state, partId) {
  if (!doesPartExist(state, partId)) {
    return null;
  }
  const part = state.entities.parts.byPartId[partId];
  return part.channelId;
}