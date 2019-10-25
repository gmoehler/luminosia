import reducer, { channelExists, getAllDenormalizedChannels } from "../achannelReducer";
import { initialState, getDenormalizedChannel } from "../achannelReducer";

import * as types from "../../actions/types";
import { normalizedImageChannel1, imageChannelState1, imageChannel1, entityState1, denormImageChannel1 } from "../../__fixtures__/entity.fixtures";
import { cloneDeep } from "lodash";

describe("part reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should create a new channel", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_CHANNEL,
      payload: normalizedImageChannel1
    });

    expect(reducer0).toEqual(imageChannelState1);
  });

  it("should clear channels", () => {

    const reducer0 = reducer(reducer(imageChannelState1, {}), {
      type: types.CLEAR_ALL_CHANNELS,
    });

    expect(reducer0).toEqual({
      ...initialState,
    });
  });

  it("should delete a channel", () => {

    const reducer0 = reducer(reducer(imageChannelState1, {}), {
      type: types.DELETE_A_CHANNEL,
      payload: imageChannel1.channelId
    });

    expect(reducer0).toEqual({
      ...initialState,
    });
  });

  it("should update gain of a channel", () => {

    const reducer0 = reducer(reducer(imageChannelState1, {}), {
      type: types.UPDATE_CHANNEL,
      payload: {
        channelId: imageChannel1.channelId,
        gain: 0.5,
      }
    });

    expect(reducer0).toEqual({
      byChannelId: {
        [imageChannel1.channelId]: { ...imageChannel1, gain: 0.5 }
      },
      allChannelIds: [imageChannel1.channelId],
      activeChannels: [],
      playingChannels: [],
    });
  });

  it("should set a channel active", () => {
    const reducer0 = reducer(reducer(imageChannelState1, {}), {
      type: types.SET_A_CHANNEL_ACTIVE,
      payload: imageChannel1.channelId
    });

    const expectedState = cloneDeep(imageChannelState1);
    // channel is contained in activeChannels
    expectedState.activeChannels = [imageChannel1.channelId];

    expect(reducer0).toEqual(expectedState);
  });

  it("should set a channel inactive", () => {

    const stateWithChannel1Active = cloneDeep(imageChannelState1);
    stateWithChannel1Active.activeChannels = [imageChannel1.channelId];

    const reducer0 = reducer(reducer(stateWithChannel1Active, {}), {
      type: types.SET_A_CHANNEL_INACTIVE,
      payload: imageChannel1.channelId
    });

    expect(reducer0).toEqual(imageChannelState1);
  });

  it("should play a channel", () => {
    const reducer0 = reducer(reducer(imageChannelState1, {}), {
      type: types.PLAY_THE_CHANNELS,
      payload: [imageChannel1.channelId]
    });

    const expectedState = cloneDeep(imageChannelState1);
    // channel is contained in playingChannels
    expectedState.playingChannels = [imageChannel1.channelId];

    expect(reducer0).toEqual(expectedState);
  });

  it("should stop a channel", () => {

    const stateWithPlayingChannels = cloneDeep(imageChannelState1);
    stateWithPlayingChannels.playingChannels = [imageChannel1.channelId];

    const reducer0 = reducer(reducer(stateWithPlayingChannels, {}), {
      type: types.STOP_ALL_CHANNELS,
      payload: imageChannel1.channelId
    });

    expect(reducer0).toEqual(imageChannelState1);
  });
});

describe("selector functions", () => {

  it("should show that channel exists", () => {

    expect(channelExists(entityState1, imageChannel1.channelId)).toBeTruthy();
  });

  it("should show that a channel does not exists", () => {

    expect(channelExists(entityState1, "channel-99")).toBeFalsy();
  });

  it("should return a denormalized channel", () => {
    expect(getDenormalizedChannel(entityState1, imageChannel1.channelId)).toEqual(denormImageChannel1);
  });

  it("should return denormalized channels", () => {
    expect(getAllDenormalizedChannels(entityState1))
      .toEqual([denormImageChannel1]);
  });

});