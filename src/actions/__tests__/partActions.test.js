import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../partActions";
import * as types from "../types";
import {
  partPayload0, partPayload0WithoutId, partPayload0WithoutChannelId,
  fullPartState0,
  normalizedPartPayload0
} from "../../__fixtures__/part.fixtures";


export const mockStore = configureMockStore([thunk]);

describe("part actions", () => {

  it("should create a channel part", () => {
    const expectedActions = [{
      type: types.ADD_A_PART,
      payload: {
        ...normalizedPartPayload0,
        channelId: "channel-1",
      }
    }];

    const store = mockStore({
      entities: {
        parts: {},
      }
    });

    const partId = store.dispatch(actions.createPart(partPayload0WithoutId));
    expect(partId).toEqual(partPayload0.partId);
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should not create a channel part without channelId", () => {
    const expectedActions = [];

    const store = mockStore({
      entities: {
        parts: {},
      }
    });

    const partId = store.dispatch(actions.createPart(partPayload0WithoutChannelId));
    expect(partId).toBeFalsy();
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should delete a channel part", () => {
    const expectedActions = [{
      type: types.DELETE_A_PART,
      payload: {
        partId: "part-1",
        channelId: "channel-1",
      }
    }];

    const store = mockStore(fullPartState0);

    store.dispatch(actions.deleteAPart("part-1"));
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);

  });

  it("should clear all channel parts", () => {
    const expectedAction = {
      type: types.CLEAR_PARTS,
    };
    expect(actions.clearParts()).toEqual(expectedAction);
  });


});