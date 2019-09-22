// reducer working on the part entities

import { combineReducers } from "redux";
import { schema } from "normalizr";

import {
  CLEAR_PARTS, ADD_A_PART, DELETE_A_PART, MOVE_A_PART, RESIZE_A_PART,
  SELECT_A_PART, DESELECT_A_PART, CLEAR_PART_SELECTION,
} from "../actions/types";

export const partSchema = new schema.Entity("byPartId", {}, {
  idAttribute: "partId"
});

export const initialState = {
  byPartId: {},
  allPartIds: [],
  selectedPartIds: [],
};

// split into 2 reducers: byPartId and allPartIds

const byPartId = (state = {}, action) => {
  switch (action.type) {

    case ADD_A_PART: {
      return {
        ...state,
        ...action.payload.entities.byPartId, // normalized parts
      };
    }

    case MOVE_A_PART:
      const part0 = state[action.payload.partId];
      const currentOffset0 = part0.offset || 0;
      const offsetIncr0 = action.payload.incr;
      const updatedOffset0 = currentOffset0 + offsetIncr0;
      const newPart0 = {
        ...part0,
        offset: Math.max(0, updatedOffset0),
      };
      return {
        ...state,
        [action.payload.partId]: newPart0,
      };

    case RESIZE_A_PART:
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


    case DELETE_A_PART:
      const newState = { ...state };
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

    case ADD_A_PART:
      return [...state, action.payload.result];

    case DELETE_A_PART:
      return state.filter(p => p !== action.payload.partId);

    case CLEAR_PARTS:
      return [];

    default:
      return state;
  }
};

const selectedPartIds = (state = [], action) => {
  switch (action.type) {

    case DELETE_A_PART:
      return state.filter(p => p !== action.payload.partId);

    case SELECT_A_PART:
      return [...state, action.payload];

    case DESELECT_A_PART:
      return state.filter(p => p !== action.payload);

    case CLEAR_PARTS:
    case CLEAR_PART_SELECTION:
      return [];

    default:
      return state;
  }
};


export default combineReducers({
  byPartId,
  allPartIds,
  selectedPartIds,
});

export function doesPartExist(state, partId) {
  return state.entities.parts.allPartIds.includes(partId);
}

export function isPartSelected(state, partId) {
  return state.entities.parts.selectedPartIds.includes(partId);
}

export function isPartSingleSelected(state, partId) {
  return state.entities.parts.selectedPartIds === [partId];
}

export function getPart(state, partId) {
  return state.entities.parts.byPartId[partId];
}

export function getAllSelectedPartIds(state) {
  return state.entities.parts.selectedPartIds;
}

export function getChannelId(state, partId) {
  if (!doesPartExist(state, partId)) {
    return null;
  }
  return getPart(state, partId).channelId;
}

