
export const partPayload0 = {
  partId: "part-1",
  imageId: "image0.png",
  channelId: "channel-1",
  offset: 0,
  duration: 1,
};

export const partPayload0WithoutId = {
  imageId: "image0.png",
  channelId: "channel-1",
  offset: 0,
  duration: 1,
};

export const partPayload0WithoutChannelId = {
  partId: "part-1",
  imageId: "image0.png",
  offset: 0,
  duration: 1,
};


export const partPayload1 = {
  partId: "part-1",
  imageId: "image1.png",
  channelId: "channel-1",
  offset: 1,
  duration: 2,
};

export const partState0 = {
  byPartId: {
    "part-1": {
      ...partPayload0,
    }
  },
  allPartIds: ["part-1"],
};

export const partState1 = {
  byPartId: {
    "part-1": {
      ...partPayload1,
    }
  },
  allPartIds: ["part-1"],
};
