import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../channelActions";
import * as types from "../types";

import { imageChannel1, normalizedPart1, normalizedPart2, normalizedImageChannel0, normalizedImageChannel1, entityState1, denormImageChannel1Import } from "../../__fixtures__/entity.fixtures";


export const mockStore = configureMockStore([thunk]);

describe("channel actions", () => {

  const store = mockStore({
    entities: {
      parts: {
        byPartId: {},
        allPartIds: [],
      },
      images: {
        byImageId: {},
        allImageIds: [],
      },
      channels: {
        byChannelId: {},
        allChannelIds: [],
      }
    }
  });

  afterEach(() => {
    actions._resetId();
    store.clearActions();
  });


  it("should add a channel", () => {
    const expectedActions = [{
      type: types.ADD_A_PART,
      payload: normalizedPart1,
    }, {
      type: types.ADD_A_PART,
      payload: normalizedPart2,
    }, {
      type: types.ADD_A_CHANNEL,
      payload: normalizedImageChannel1,
    }];

    const channelId = store.dispatch(actions.addAChannel(denormImageChannel1Import));
    expect(channelId).toEqual(imageChannel1.channelId);
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should not create a channel without sampleRate", () => {
    const expectedActions = [];

    const denormImageChannel1WithoutSampleRate = {
      ...denormImageChannel1Import
    };
    delete denormImageChannel1WithoutSampleRate.sampleRate;

    const channelId = store.dispatch(actions.addAChannel(denormImageChannel1WithoutSampleRate));
    expect(channelId).toBeFalsy();
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should create an empty image channel", () => {
    const expectedActions = [{
      type: types.ADD_A_CHANNEL,
      payload: normalizedImageChannel0,
    }];

    const channelId = store.dispatch(actions.createAnImageChannel());
    expect(channelId).toEqual(imageChannel1.channelId);
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should delete a channel", () => {
    const expectedActions = [{
      type: types.DELETE_A_CHANNEL,
      payload: imageChannel1.channelId
    }];

    const store = mockStore(entityState1);

    store.dispatch(actions.deleteAChannel(imageChannel1.channelId));
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);

  });

  it("should clear all channels", () => {
    const expectedAction = {
      type: types.CLEAR_ALL_CHANNELS,
    };
    expect(actions.clearAllChannels()).toEqual(expectedAction);
  });


});