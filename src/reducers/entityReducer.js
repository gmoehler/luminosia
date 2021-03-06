
import { combineReducers } from "redux";

import {
  SELECT_ENTITY, DESELECT_ENTITY, CLEAR_ENTITY_SELECTION,
  DELETE_PART, CLEAR_PARTS, REMOVE_IMAGE, CLEAR_IMAGELIST, COPY_ENTITIES
} from "../actions/types";

import imageListReducer, { imageExists, initialState as initialImageListState } from "./imageListReducer";
import channelReducer, { channelExists, initialState as initialChannelState } from "./channelReducer";
import partReducer, { partExists, initialState as initialPartState } from "./partReducer";
import markerReducer, { markerExists, initialState as initialMarkerState } from "./markerReducer";

export const initialState = {
  images: initialImageListState,
  channels: initialChannelState,
  parts: initialPartState,
  markers: initialMarkerState,
  selectedEntityIds: [],
  entityIdsToCopy: [],
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

    case DELETE_PART:
      return state.filter(p => p !== action.payload.partId);

    case REMOVE_IMAGE:
      return state.filter(p => p !== action.payload);

    default:
      return state;
  }
};

const entityIdsToCopy = (state = [], action) => {
  switch (action.type) {

    case COPY_ENTITIES:
      return [...action.payload];

    default:
      return state;
  }
};

export default combineReducers({
  parts: partReducer,
  images: imageListReducer,
  markers: markerReducer,
  channels: channelReducer,
  selectedEntityIds,
  entityIdsToCopy,
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

export function getEntityType(state, entityId) {
  if (partExists(state, entityId)) {
    return "part";
  } else if (imageExists(state, entityId)) {
    return "image";
  } else if (markerExists(state, entityId)) {
    return "marker";
  } else if (channelExists(state, entityId)) {
    return "channel";
  }
  return "unknown";
}

export function isEntitySelectable(state, entityId) {
  return ["part", "image"].includes(getEntityType(state, entityId));
}

// only one type of entities can be selected 
// currently only part or image
export function getSelectedEntityType(state) {
  if (state.entities.selectedEntityIds.length === 0) {
    return "none";
  }
  return getEntityType(state, state.entities.selectedEntityIds[0]);
}

export function getSelectedEntityIds(state) {
  return state.entities.selectedEntityIds;
}

export function getSelectedEntityIdsOfType(state, type) {
  return getSelectedEntityType(state) === type ?
    getSelectedEntityIds(state) : [];
}

export function anyEntitySelected(state) {
  return getSelectedEntityIds(state).length > 0;
}

export function getEntitiesIdsToCopy(state) {
  return state.entities.entityIdsToCopy;
}