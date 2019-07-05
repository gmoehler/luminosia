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

// currently no assumptions are made for the fields in part

export default (state = initialState, action) => {
  switch (action.type) {

    case ADD_PART:
      const nextPartId = state.lastPartId + 1;
      return {
        ...state,
        // add to byPartId
        byPartId: {
          ...state.byPartId,
          [nextPartId]: {
            ...action.payload,
            partId: nextPartId
          }
        },
        // add id to allPartIds
        allPartIds: [
          ...state.allPartIds,
          nextPartId,
        ],
        // increment last part id
        lastPartId: nextPartId,
      };

    case UPDATE_PART:
      const partId0 = action.payload && action.payload.partId;
      if (partId0 === null || partId0 === undefined       // 0 is valid
        || partId0 < 0 || !state.allPartIds.includes(partId0)) {
        console.log("cannot update part with ", action.payload);
        return state;
      }
      // only update byPartId
      return {
        ...state,
        byPartId: {
          ...state.byPartId,
          [partId0]: {
            ...state.byPartId[partId0],
            ...action.payload
          },
        },
      };

    case DELETE_PART:
      const partId1 = action.payload;
      if (partId1 === null || partId1 === undefined       // 0 is valid
        || partId1 < 0 || !state.allPartIds.includes(partId1)) {
        console.log("cannot delete part with ", action.payload);
        return state;
      }
      // remove from byPartId
      const nextByPartId = { ...state.byPartId };
      delete nextByPartId[partId1];
      return {
        ...state,
        byPartId: nextByPartId,
        // remove id from allPartIds
        allPartIds: [
          ...state.allPartIds.filter(id => id !== partId1)],
      };

    case CLEAR_PARTS:
      return initialState;

    default:
      return state;

  }
};