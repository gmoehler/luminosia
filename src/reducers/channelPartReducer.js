import {
  CLEAR_PARTS,
  ADD_PART,
  UPDATE_PART,
  DELETE_PART,
} from "../actions/types";


export const initialState = {
  byPartId: {},
  allPartIds: [],
  lastPartId: -1,
};

export default (state = initialState, action) => {
  switch (action.type) {

    case CLEAR_PARTS:
      return initialState;

    case ADD_PART:
      const nextPartId = state.lastPartId + 1;
      return {
        ...state,
        byPartId: {
          ...state.byPartId,
          [nextPartId]: {
            ...action.payload,
            partId: nextPartId
          }
        },
        allPartIds: [
          ...state.allPartIds,
          nextPartId,
        ],
        lastPartId: nextPartId,
      };

    case UPDATE_PART:
      const partId = action.payload.partId;
      return {
        ...state,
        byPartId: {
          ...state.byPartId,
          [partId]: {
            ...state.byPartId[partId],
            ...action.payload
          },
        },
      };

    case DELETE_PART:
      const nextByPartId = { ...state.byPartId };
      delete nextByPartId[action.payload];
      return {
        ...state,
        byPartId: nextByPartId,
        allPartIds: [
          ...state.allPartIds.filter(part => part.partId !== action.partId)],
      };

    default:
      return state;

  }
};