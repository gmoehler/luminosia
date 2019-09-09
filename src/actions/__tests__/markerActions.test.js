import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../markerActions";
import * as types from "../types";
import {
  markerPayload0, markerPayload1, fullMarkerState0
} from "../../__fixtures__/marker.fixtures";


export const mockStore = configureMockStore([thunk]);

describe("marker actions", () => {

  it("should set a marker", () => {
    const expectedActions = [{
      type: types.SET_A_MARKER,
      payload: markerPayload0
    }];

    const store = mockStore({
      entities: {
        markers: {
          byMarkerId: {},
          allMarkerIds: []
        },
      }
    });

    const markerId = store.dispatch(actions.setAMarker(markerPayload1));
    expect(markerId).toEqual(markerPayload0.markerId);
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should add an marker with existing markerId to the list", () => {
    const expectedActions = [{
      type: types.SET_A_MARKER,
      payload: markerPayload0
    }];

    const store = mockStore({
      entities: {
        markers: {
          byMarkerId: {},
          allMarkerIds: []
        },
      }
    });

    const markerId = store.dispatch(actions.setAMarker(markerPayload0));
    expect(markerId).toEqual(markerPayload0.markerId);
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should clear markers", () => {
    const expectedActions = [{
      type: types.CLEAR_MARKERS,
    }];

    const store = mockStore({
      entities: {
        markers: {
          byMarkerId: {},
          allMarkerIds: []
        },
      }
    });

    store.dispatch(actions.clearMarkers());
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should update a marker with incr", () => {
    const expectedActions = [{
      type: types.UPDATE_A_MARKER,
      payload: { markerId: "part-2--left", incr: 12 },
    }];

    const store = mockStore(fullMarkerState0);

    store.dispatch(actions.updateAMarker(
      { markerId: "part-2--left", incr: 12 }));
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should update a marker with pos", () => {
    const expectedActions = [{
      type: types.UPDATE_A_MARKER,
      payload: { markerId: "part-2--left", pos: 12 },
    }];

    const store = mockStore(fullMarkerState0);

    store.dispatch(actions.updateAMarker(
      { markerId: "part-2--left", pos: 12 }));
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should update a marker with type", () => {
    const expectedActions = [{
      type: types.UPDATE_A_MARKER,
      payload: { markerId: "part-2--left", type: "part-22--right" },
    }];

    const store = mockStore(fullMarkerState0);

    store.dispatch(actions.updateAMarker(
      { markerId: "part-2--left", type: "part-22--right" }));
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });



  it("should not update a non existing marker", () => {

    const store = mockStore(fullMarkerState0);

    store.dispatch(actions.updateAMarker(
      { markerId: "unkown-marker", incr: 12 }));
    const acts = store.getActions();
    expect(acts).toEqual([]);
  });


  it("should not update when no update info is present", () => {

    const store = mockStore(fullMarkerState0);

    store.dispatch(actions.updateAMarker(
      { markerId: "part-2--left" }));
    const acts = store.getActions();
    expect(acts).toEqual([]);
  });



  it("should delete a marker", () => {
    const expectedActions = [{
      type: types.DELETE_A_MARKER,
      payload: "part-2--left"
    }];

    const store = mockStore(fullMarkerState0);

    store.dispatch(actions.deleteAMarker("part-2--left"));
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });


  it("should do nothing when a marker to remove does not exist", () => {

    const store = mockStore(fullMarkerState0);

    store.dispatch(actions.deleteAMarker("nonexisting-marker"));
    const acts = store.getActions();
    expect(acts).toEqual([]);
  });

});