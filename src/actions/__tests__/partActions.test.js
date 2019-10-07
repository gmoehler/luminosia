import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../partActions";
import * as types from "../types";
import { part1WithoutId, normalizedPart1, part1, entityState1, entityState0 } from "../../__fixtures__/entity.fixtures";

export const mockStore = configureMockStore([thunk]);

describe("part actions", () => {

  const store = mockStore(entityState0);

  afterEach(() => {
    store.clearActions();
  });

  it("should create a channel part", () => {
    const expectedActions = [{
      type: types.ADD_A_PART,
      payload: {
        ...normalizedPart1,
      }
    }];

    const partId = store.dispatch(actions.createPart(part1WithoutId));
    expect(partId).toEqual(part1.partId);
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should not create a channel part without channelId", () => {
    const expectedActions = [];

    const part1WithoutIdNorChannelId = {
      ...part1WithoutId
    };
    delete part1WithoutIdNorChannelId.channelId;

    const partId = store.dispatch(actions.createPart(part1WithoutIdNorChannelId));
    expect(partId).toBeFalsy();
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should delete a channel part", () => {
    const expectedActions = [{
      type: types.DELETE_A_PART,
      payload: {
        partId: part1.partId,
        channelId: "channel-1",
      }
    }];

    const store2 = mockStore(entityState1);

    store2.dispatch(actions.deleteAPart(part1.partId));
    const acts = store2.getActions();
    expect(acts).toEqual(expectedActions);

  });

  it("should clear all channel parts", () => {
    const expectedAction = {
      type: types.CLEAR_PARTS,
    };
    expect(actions.clearParts()).toEqual(expectedAction);
  });

  // TODO add tests for movePart and resizePart

});