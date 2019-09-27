import reducer, { channelExists } from "../achannelReducer";
import { initialState } from "../achannelReducer";

import * as types from "../../actions/types";
import {
  imageChannelState0, normalizedImageChannelPayload0, fullChannelState0
} from "../../__fixtures__/channel.fixtures";

describe("part reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should create a new channel", () => {
    const reducer0 = reducer(reducer(undefined, {}), {
      type: types.ADD_A_CHANNEL,
      payload: normalizedImageChannelPayload0
    });

    expect(reducer0).toEqual(imageChannelState0);
  });

  it("should clear channels", () => {

    const reducer0 = reducer(reducer(undefined, imageChannelState0), {
      type: types.CLEAR_ALL_CHANNELS,
    });

    expect(reducer0).toEqual({
      ...initialState,
    });
  });

  it("should delete a channel", () => {

    const reducer0 = reducer(reducer(undefined, imageChannelState0), {
      type: types.DELETE_A_CHANNEL,
      payload: "channel-1"
    });

    expect(reducer0).toEqual({
      ...initialState,
    });
  });

});

describe("selector functions", () => {

  it("should show that channel exists", () => {

    expect(channelExists(fullChannelState0, "channel-1")).toBeTruthy();
  });

  it("should show that a channel does not exists", () => {

    expect(channelExists(fullChannelState0, "channel-99")).toBeFalsy();
  });

});