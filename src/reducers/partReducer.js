import {
  CLEAR_PARTS, ADD_A_PART, UPDATE_A_PART, DELETE_A_PART,
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

    case UPDATE_A_PART:
      const partId1 = action.payload && action.payload.partId;
      if (!partId1) {
        return state;
      }
      const exists1 = state.allPartIds.includes(partId1);
      if (!exists1) {
        return state;
      }
      return {
        ...state,

        // add to byPartId
        byPartId: {
          ...state.byPartId,
          [partId1]: {
            ...state.byPartId[partId1],
            ...action.payload,
          }
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