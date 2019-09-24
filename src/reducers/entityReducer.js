
import { combineReducers } from "redux";

import {
  SELECT_ENTITY, DESELECT_ENTITY, CLEAR_ENTITY_SELECTION,
  DELETE_A_PART, CLEAR_PARTS, REMOVE_IMAGE, CLEAR_IMAGELIST
} from "../actions/types";

import partReducer, { doesPartExist } from "./partReducer";
import markerReducer from "./markerReducer";
import imageListReducer, { imageExists } from "./imageListReducer";

export const initialState = {
  selectedEntityIds: [],
};

const selectedEntityIds = (state = [], action) => {
  switch (action.type) {

    case SELECT_ENTITY:
      return [...state, action.payload];

    case DESELECT_ENTITY:
      return state.filter(p => p !== action.payload);

    case CLEAR_ENTITY_SELECTION:
    case CLEAR_IMAGELIST:
    case CLEAR_PARTS:
      return [];

    case DELETE_A_PART:
      return state.filter(p => p !== action.payload.partId);

    case REMOVE_IMAGE:
      return state.filter(p => p !== action.payload);

    default:
      return state;
  }
};

export default combineReducers({
  parts: partReducer,
  images: imageListReducer,
  markers: markerReducer,
  selectedEntityIds,
});

export function entityExists(state, entityId) {
  return state.entities.images.allImageIds.includes(entityId) ||
    state.entities.parts.allPartIds.includes(entityId);
}

export function isEntitySelected(state, entityId) {
  return state.entities.selectedEntityIds.includes(entityId);
}

export function isEntitySingleSelected(state, entityId) {
  return state.entities.selectedEntityIds === [entityId];
}

// only one type of entities can be selected 
// currently only part or image
export function getSelectedEntityType(state) {
  if (state.entities.selectedEntityIds.length === 0) {
    return "none";
  } else if (doesPartExist(state.entities.selectedEntityIds[0])) {
    return "part";
  } else if (imageExists(state.entities.selectedEntityIds[0])) {
    return "image";
  }
  return "unknown";
}