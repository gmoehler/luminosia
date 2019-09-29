import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../channelActions";
import * as types from "../types";
import { channelPayload0WithoutSampleRate, denormChannelPayload0, normalizedImageChannel0, normalizedEmptyImageChannel, fullChannelState0 } from "../../__fixtures__/channel.fixtures";
import { normalizedPartPayload2, normalizedPartPayload0 } from "../../__fixtures__/part.fixtures";


export const mockStore = configureMockStore([thunk]);

describe("channel actions", () => {

  afterEach(() => {
    actions._resetId();
  });


  it("should add a channel", () => {
    const expectedActions = [{
      type: types.ADD_A_PART,
      payload: normalizedPartPayload0,
    }, {
      type: types.ADD_A_PART,
      payload: normalizedPartPayload2,
    }, {
      type: types.ADD_A_CHANNEL,
      payload: normalizedImageChannel0,
    }];

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

    const channelId = store.dispatch(actions.addAChannel(denormChannelPayload0));
    expect(channelId).toEqual("channel-1");
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should not create a channel without sampleRate", () => {
    const expectedActions = [];

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

    const channelId = store.dispatch(actions.addAChannel(channelPayload0WithoutSampleRate));
    expect(channelId).toBeFalsy();
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should create an empty image channel", () => {
    const expectedActions = [{
      type: types.ADD_A_CHANNEL,
      payload: normalizedEmptyImageChannel,
    }];

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

    const channelId = store.dispatch(actions.createAnImageChannel());
    expect(channelId).toEqual("channel-1");
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });

  it("should delete a channel", () => {
    const expectedActions = [{
      type: types.DELETE_A_CHANNEL,
      payload: "channel-1"
    }];

    const store = mockStore(fullChannelState0);

    store.dispatch(actions.deleteAChannel("channel-1"));
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