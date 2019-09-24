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
    // ensure that entity exists and is selectable
    if (entityExists(getState(), entityId) && isEntitySelectable(entityId)) {
      dispatch(_selectEntity(entityId));
    } else {
      console.error("entity to select does not exist:", entityId);
    }
  };
};

// no checks are required: reducer works for unknown entities
const deselectEntity = (entityId) => ({
  type: DESELECT_ENTITY,
  payload: entityId
});

export const _clearEntitySelection = () => ({
  type: CLEAR_ENTITY_SELECTION
});

export const clearEntitySelection = () => {
  return (dispatch, getState) => {
      dispatch(_clearEntitySelection());
      dispatch(clearMarkers());  // just do it in any case
  };
};

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
    	
      // if other entity type was selected: clean selection first
      if (getEntityType(entityId) !== getSelectedEntityType(getState())) {
        	dispatch(clearEntitySelection());
            dispatch(selectEntity(entityId));
      }
      
      else if (isEntitySelected(getState(), entityId)) {
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
      if (!isEntitySelected(getState(), entityId) {
        dispatch(clearEntitySelection());
        dispatch(selectEntity(entityId));
      }
    }
  };
});
