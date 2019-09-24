import { SELECT_ENTITY, DESELECT_ENTITY, CLEAR_ENTITY_SELECTION, } from "./types";
import { entityExists, isEntitySingleSelected, isEntitySelected } from "../reducers/entityReducer";
import { clearMarkers, addPartSelectionMarkers } from "./markerActions";
import { doesPartExist, getPart } from "../reducers/partReducer";

const _selectEntity = (entityId) => ({
  type: SELECT_ENTITY,
  payload: entityId
});

export const selectEntity = (entityId) => {
  return (dispatch, getState) => {
    // ensure that entity exists
    if (entityExists(getState(), entityId)) {
      dispatch(_selectEntity(entityId));
    } else {
      console.error("entity to select does not exist:", entityId);
    }
  };
};

const _deselectEntity = (entityId) => ({
  type: DESELECT_ENTITY,
  payload: entityId
});

export const deselectEntity = (entityId) => {
  return (dispatch, getState) => {
    // ensure that entity exists
    if (entityExists(getState(), entityId)) {
      dispatch(_deselectEntity(entityId));
    } else {
      console.error("entity to deselect does not exist:", entityId);
    }
  };
};

export const clearEntitySelection = () => ({
  type: CLEAR_ENTITY_SELECTION
});

/**********************************/
/*  Different selection functions */
/**********************************/

// only one enity can be selected (for single click)
export const toggleEntitySelection = ((entityId) => {
  return (dispatch, getState) => {

    // ensure we have what we need
    // so reducers do not need to check assumptions
    if (entityId && entityExists(getState(), entityId)) {

      const entitySingleSelected = isEntitySingleSelected(getState(), entityId);
      // simpler to deselect everything instead of deselection prev selection
      dispatch(clearEntitySelection());
      dispatch(clearMarkers());

      if (!entitySingleSelected) {
        dispatch(selectEntity(entityId));
        // in case this is a pat: add markers
        if (doesPartExist(getState(), entityId)) {
          const part = getPart(getState(), entityId);
          dispatch(addPartSelectionMarkers(part));
        }
      }
    }
  };
});

// many entities can be selected (for ctrl-click)
export const toggleMultiEntitySelection = ((entityId) => {
  return (dispatch, getState) => {

    // check condition
    if (entityId && entityExists(getState(), entityId)) {
      if (isEntitySelected(getState(), entityId)) {
        dispatch(deselectEntity(entityId));
      } else {
        dispatch(selectEntity(entityId));
      }
    }
  };
});

// adds entity selection if not yet selected (for mouse-down-click)
export const toggleInitialEntitySelection = ((entityId) => {
  return (dispatch, getState) => {

    // check condition
    if (entityId && entityExists(getState(), entityId)) {
      if (!isEntitySelected(getState(), entityId)) {
        dispatch(clearEntitySelection());
        dispatch(selectEntity(entityId));
      }
    }
  };
});
