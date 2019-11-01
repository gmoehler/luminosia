import {
  SELECT_ENTITY, DESELECT_ENTITY, CLEAR_ENTITY_SELECTION, COPY_ENTITIES,
} from "./types";
import { entityExists, isEntitySingleSelected, isEntitySelected, getSelectedEntityType, getEntityType, isEntitySelectable, getSelectedEntityIds, getSelectedEntityIdsOfType, getEntitiesIdsToCopy } from "../reducers/entityReducer";
import { clearMarkers, addPartSelectionMarkers, deletePartSelectionMarkers } from "./markerActions";
import { partExists, getPart } from "../reducers/partReducer";
import { removeImage } from "./imageListActions";
import { deleteAPart, createPart } from "./partActions";
import { getSelectedImageChannelId } from "../reducers/viewReducer";

const _selectEntity = (entityId) => ({
  type: SELECT_ENTITY,
  payload: entityId
});

export function selectEntity(entityId) {
  return (dispatch, getState) => {
    // ensure that entity exists and is selectable
    if (entityExists(getState(), entityId) && isEntitySelectable(getState(), entityId)) {
      if (!isEntitySelected(getState(), entityId)) {
        dispatch(_selectEntity(entityId));
        // for part: also add markers
        if (partExists(getState(), entityId)) {
          const part = getPart(getState(), entityId);
          dispatch(addPartSelectionMarkers(part));
          // channel is directly selected thru mouse handler
        }
      }
    } else {
      console.error("entity to select does not exist or is not selectable:", entityId);
    }
  };
};

export const _deselectEntity = (entityId) => ({
  type: DESELECT_ENTITY,
  payload: entityId
});

export function deselectEntity(entityId) {
  return (dispatch, getState) => {
    // ensure that entity exists and is selectable
    if (entityExists(getState(), entityId) && isEntitySelectable(getState(), entityId)) {
      dispatch(_deselectEntity(entityId));
      // for part: also delete markers
      if (partExists(getState(), entityId)) {
        dispatch(deletePartSelectionMarkers(entityId));
      }
    } else {
      console.error("entity to deselect does not exist or is not selectable:", entityId);
    }
  };
};

export const _clearEntitySelection = () => ({
  type: CLEAR_ENTITY_SELECTION
});

export function clearEntitySelection() {
  return (dispatch, getState) => {
    dispatch(_clearEntitySelection());
    dispatch(clearMarkers()); // just do it in any case
  };
};

// TODO: think about entity reducer actions instead of part/image actions
export function deleteSelectedEntities() {
  return (dispatch, getState) => {
    // assuming all entities are of the same type
    const entityType = getSelectedEntityType(getState());

    getSelectedEntityIds(getState()).forEach((entityId) => {
      if (entityType === "part") {
        dispatch(deleteAPart(entityId));
        dispatch(deletePartSelectionMarkers(entityId));
      } else if (entityType === "image") {
        dispatch(removeImage(entityId));
      }
    });
  };
};

export const _copyEntities = (entityIds) => ({
  type: COPY_ENTITIES,
  payload: entityIds
});

// we only copy parts for now, no other entity types
export function copyParts() {
  return (dispatch, getState) => {
    const parts = getSelectedEntityIdsOfType(getState(), "part");
    if (parts.length > 0) {
      dispatch(_copyEntities(parts));
    }
  };
};

export const pasteParts = () => {
  return (dispatch, getState) => {
    // expect only parts here
    getEntitiesIdsToCopy(getState()).forEach((partId) => {
      const originalPart = getPart(getState(), partId);
      const selectedImageChannelId = getSelectedImageChannelId(getState());

      if (selectedImageChannelId) {
        const partToPaste = {
          ...originalPart,
          channelId: selectedImageChannelId,
        };
        dispatch(createPart(partToPaste));
      }
    });
  };
};

/*********************************/
/* Different selection functions */
/*********************************/

// only one enity can be selected (for single click)
export function toggleEntitySelection(entityId) {
  return (dispatch, getState) => {

    // ensure we have what we need
    // so reducers do not need to check assumptions
    if (entityId && entityExists(getState(), entityId)) {

      const entitySingleSelected = isEntitySingleSelected(getState(), entityId);
      // simpler to deselect everything instead of deselection prev selection
      dispatch(clearEntitySelection());

      if (!entitySingleSelected) {
        dispatch(selectEntity(entityId));
      }
    }
  };
};

// many entities can be selected (for ctrl-click)
export function toggleMultiEntitySelection(entityId) {
  return (dispatch, getState) => {

    // check condition
    if (entityId && entityExists(getState(), entityId)) {

      // if other entity type was selected: clean selection first
      if (getEntityType(getState(), entityId) !== getSelectedEntityType(getState())) {
        dispatch(clearEntitySelection());
        dispatch(selectEntity(entityId));
      } else if (isEntitySelected(getState(), entityId)) {
        dispatch(deselectEntity(entityId));
      } else {
        dispatch(selectEntity(entityId));
      }
    }
  };
};

// adds entity selection if not yet selected (for mouse-down-click)
export function toggleInitialEntitySelection(entityId) {
  return (dispatch, getState) => {

    // check condition
    if (entityId && entityExists(getState(), entityId)) {
      if (!isEntitySelected(getState(), entityId)) {
        dispatch(clearEntitySelection());
        dispatch(selectEntity(entityId));
      }
    }
  };
};
