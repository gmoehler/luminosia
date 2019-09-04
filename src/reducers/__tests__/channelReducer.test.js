import reducer, { getAllChannelsData, denormalizeChannel, denormalizeChannels } from "../channelReducer";
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
          parts: [],
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
          parts: ["part-1"],
        }
      },
      lastChannelId: 0,

    });
  });


  it("should return denormalized one channel", () => {

    const state = {
      entities: {
        parts: {
          byPartId: {
            "part-1": {
              partId: "part-1",
              imageId: "image1.png",
              channelId: "channel-1",
              offset: 0,
              duration: 1,
            },
            "part-2": {
              partId: "part-2",
              imageId: "image2.png",
              channelId: "channel-1",
              offset: 0,
              duration: 1,
            }
          }
        }
      }
    };

    const channel = {
      channelId: "channel-1",
      parts: ["part-2"]
    };

    expect(denormalizeChannel(state, channel)).toEqual({
      channelId: "channel-1",
      parts: [{
        partId: "part-2",
        imageId: "image2.png",
        channelId: "channel-1",
        offset: 0,
        duration: 1,
      }]
    });
  });

  it("should return denormalized multiple channels", () => {

    const state = {
      entities: {
        parts: {
          byPartId: {
            "part-1": {
              partId: "part-1",
              imageId: "image1.png",
              channelId: "channel-2",
              offset: 0,
              duration: 1,
            },
            "part-2": {
              partId: "part-2",
              imageId: "image2.png",
              channelId: "channel-1",
              offset: 0,
              duration: 2,
            }
          }
        }
      }
    };

    const channel = [{
      channelId: "channel-2",
      parts: ["part-1"]
    }, {
      channelId: "channel-1",
      parts: ["part-2"]
    }];

    expect(denormalizeChannels(state, channel)).toEqual([{
      channelId: "channel-2",
      parts: [{
        partId: "part-1",
        imageId: "image1.png",
        channelId: "channel-2",
        offset: 0,
        duration: 1,
      }]
    }, {
      channelId: "channel-1",
      parts: [{
        partId: "part-2",
        imageId: "image2.png",
        channelId: "channel-1",
        offset: 0,
        duration: 2,
      }]
    }]);
  });


  it("should return all channels data", () => {
    const state = {
      channel: {
        byChannelId: {
          "channel-2": {
            channelId: "channel-2",
            duration: 11,
            parts: ["part-1"]
          },
          "channel-1": {
            channelId: "channel-1",
            duration: 22,
            parts: ["part-2"]
          }
        }
      },
      entities: {
        parts: {
          byPartId: {
            "part-1": {
              partId: "part-1",
              imageId: "image1.png",
              channelId: "channel-2",
              offset: 0,
              duration: 1,
            },
            "part-2": {
              partId: "part-2",
              imageId: "image2.png",
              channelId: "channel-1",
              offset: 0,
              duration: 2,
            }
          }
        }
      }
    };

    expect(getAllChannelsData(state)).toEqual([{
      channelId: "channel-1",
      duration: 22,
      parts: [{
        partId: "part-2",
        imageId: "image2.png",
        channelId: "channel-1",
        offset: 0,
        duration: 2,
      }]
    }, {
      channelId: "channel-2",
      duration: 11,
      parts: [{
        partId: "part-1",
        imageId: "image1.png",
        channelId: "channel-2",
        offset: 0,
        duration: 1,
      }]
    }]);
  });

});