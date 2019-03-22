import reducer from "../channelReducer";
import * as types from "../../actions/types";
import { audioChannelPayload, imageChannelPayload } from "../../__fixtures__/channel.fixtures";

describe("channel reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(
      {
        byChannelId: {},
        lastChannelId: -1
      }
    );
  });

  it("should handle ADD_CHANNEL for an audio channel", () => {
    expect(
      reducer(reducer(undefined, {}), {
        type: types.ADD_CHANNEL,
        payload: audioChannelPayload
      })
    ).toEqual({
      byChannelId: {
        0: {
          ...audioChannelPayload,
          channelId: 0,
          lastPartSeqNum: -1,
          byPartId: {},
        }
      },
      lastChannelId: 0,

    });
  });

  it("should handle ADD_CHANNEL for an image channel", () => {
    expect(
      reducer(reducer(undefined, {}), {
        type: types.ADD_CHANNEL,
        payload: imageChannelPayload
      })
    ).toEqual({
      byChannelId: {
        0: {
          ...imageChannelPayload,
          channelId: 0,
          lastPartSeqNum: -1, // update is done by action not reducer
          byPartId: {},
        }
      },
      lastChannelId: 0,

    });
  });


});