
export const partPayload0 = {
  partId: "1",
  length: 10,
  imageId: "image0.png",
  src: "data:image/png;base64",
  offset: 0,
  duration: 1,
};

export const partPayload0WithoutId = {
  length: 10,
  imageId: "image0.png",
  src: "data:image/png;base64",
  offset: 0,
  duration: 1,
};


export const partPayload1 = {
  partId: "1",
  length: 11,
  imageId: "image1.png",
  src: "data:image/png;base64",
  offset: 1,
  duration: 2,
};

export const partState0 = {
  byPartId: {
    "1": {
      ...partPayload0,
    }
  },
  allPartIds: ["1"],
};

export const partState1 = {
  byPartId: {
    "1": {
      ...partPayload1,
    }
  },
  allPartIds: ["1"],
};


export const imageChannelState = {
  channel: {
    lastChannelId: 2,
    byChannelId: {
      1: {
        channelId: 1,
        type: "image",
        playState: "stopped",
        sampleRate: 100,
        duration: 21.21,
        active: true,
        lastPartSeqNum: 1,
        byPartId: {
        }, // byPartId
      },
      2: {
        channelId: 2,
        type: "image",
        playState: "stopped",
        sampleRate: 100,
        duration: 21.21,
        active: true,
        lastPartSeqNum: 1,
        byPartId: {
          "2:1": {
            partId: "2:1",
            channelId: 2,
            offset: 3.3,
            duration: 11.21,
            sampleRate: 100,
          }
        }, // byPartId
      }
    } // byChannelId
  } // channel
};

export const part = {
  partId: "2:1",
  channelId: 2,
  offset: 3.3,
  duration: 11.21,
  sampleRate: 100,
};

export const part2 = {
  partId: "2:5",
  channelId: 3,
  offset: 5.5,
  duration: 55.55,
  sampleRate: 100,
};