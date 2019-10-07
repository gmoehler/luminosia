import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../channelActions";
import { _setInitialPartIdCount } from "../partActions";
import * as types from "../types";

import { imageChannel1, normalizedPart1, normalizedPart2, normalizedImageChannel0, normalizedImageChannel1, entityState0, entityState1, denormImageChannel1Import, normalizedImageChannel2, imageChannel2, normalizedPart4, normalizedPart3,
} from "../../__fixtures__/entity.fixtures";

export const mockStore = configureMockStore([thunk]);

describe("channel actions", () => {

  const store = mockStore(entityState0);

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

  it("should duplicate a channel", () => {

    const expectedActions = [{
      type: types.ADD_A_PART,
      payload: normalizedPart3,
    }, {
      type: types.ADD_A_PART,
      payload: normalizedPart4,
    }, {
      type: types.ADD_A_CHANNEL,
      payload: normalizedImageChannel2,
    }];

    const store2 = mockStore(entityState1);
    actions._setInitialChannelIdCount(1); // pretend we have already created one channel ...
    _setInitialPartIdCount(2); // ... and 2 parts

    const channel2Id = store2.dispatch(actions.duplicateImageChannel(imageChannel1.channelId));
    expect(channel2Id).toEqual(imageChannel2.channelId);
    const acts = store2.getActions();
    expect(acts).toEqual(expectedActions);
  });


});