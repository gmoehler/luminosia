import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../partActions";
import * as types from "../types";
import { partPayload0, partPayload0WithoutId, partPayload1 } from "../../__fixtures__/part.fixtures";


export const mockStore = configureMockStore([thunk]);

describe("part actions", () => {

  it("should create a channel part", () => {
    const expectedActions = [{
      type: types.ADD_NEW_PART,
      payload: partPayload0
    }];

    const store = mockStore({
      channel: {
        byChannelId: {},
        lastChannelId: -1
      }
    });

    store.dispatch(actions.createPart(partPayload0WithoutId));
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });


  it("should update a channel part", () => {
    const expectedAction = {
      type: types.UPDATE_PART,
      payload: partPayload1
    };
    expect(actions.updatePart(partPayload1)).toEqual(expectedAction);
  });


  it("should delete a channel part", () => {
    const expectedAction = {
      type: types.DELETE_PART,
      payload: 0
    };
    expect(actions.deletePart(0)).toEqual(expectedAction);
  });

  it("should clear all channel parts", () => {
    const expectedAction = {
      type: types.CLEAR_PARTS,
    };
    expect(actions.clearParts()).toEqual(expectedAction);
  });


});