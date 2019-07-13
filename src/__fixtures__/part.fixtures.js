
export const partPayload0 = {
  partId: "part-1",
  imageId: "image1.png",
  channelId: "channel-1",
  offset: 0,
  duration: 1,
};

export const normalizedPartPayload0 = {
  entities: {
    parts: {
      "part-1": {
        partId: "part-1",
        imageId: "image1.png",
        channelId: "channel-1",
        offset: 0,
        duration: 1,
      }
    }
  },
  result:
    "part-1"
};

export const partPayload0WithoutId = {
  ...partPayload0
};
delete partPayload0WithoutId.partId;

export const partPayload0WithoutChannelId = {
  ...partPayload0
};
delete partPayload0WithoutChannelId.channelId;

export const partPayload1 = {
  partId: "part-1",
  imageId: "image2.png",
  channelId: "channel-1",
  offset: 1,
  duration: 2,
};

export const partState0 = {
  byPartId: {
    "part-1": partPayload0,
  },
  allPartIds: ["part-1"],
};

export const fullPartState0 = {
  entities: {
    parts: partState0
  }
};

export const partState1 = {
  byPartId: {
    "part-1": {
      ...partPayload1,
    }
  },
  allPartIds: ["part-1"],
};
