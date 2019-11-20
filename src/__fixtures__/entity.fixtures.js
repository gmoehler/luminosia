import { initialState as initialEntityState } from "../reducers/entityReducer";

//////////////////////
// single entities //
//////////////////////

// parts
export const part1WithoutId = {
  imageId: "image1.png",
  channelId: "channel-image-1",
  offset: 1,
  duration: 1,
};

export const part1 = {
  ...part1WithoutId,
  partId: "part-1",
};
// different part, same channel
export const part2 = {
  partId: "part-2",
  imageId: "image2.png",
  channelId: part1.channelId,
  offset: 2,
  duration: 2,
};
// a copy of part1, but in channel2
export const part3 = {
  ...part1,
  partId: "part-3",
  channelId: "channel-image-2",
};
// a copy of part2, but in channel2
export const part4 = {
  ...part2,
  partId: "part-4",
  channelId: "channel-image-2",
};

// image channel without parts
export const imageChannel0 = {
  channelId: "channel-image-1",
  type: "image",
  sampleRate: 100,
  duration: 10,
  gain: 1,
  parts: [],
  minPartDuration: 0.0625,
  snapDist: 0.125,
};

// image channel with 2 parts
// as stored externally
export const imageChannel1Import = {
  type: "image",
  sampleRate: 100,
  duration: 55.5,
  gain: 1,
  minPartDuration: 0.0625,
  snapDist: 0.125,
  parts: ["part-1", "part-2"]
};
// copied channel imageChannel1Import 
export const imageChannel2Import = {
  type: "image",
  sampleRate: 100,
  duration: 55.5,
  gain: 1,
  minPartDuration: 0.0625,
  snapDist: 0.125,
  parts: ["part-3", "part-4"]
};

// image channel with props added by action
export const imageChannel1 = {
  ...imageChannel1Import,
  channelId: "channel-image-1",
  gain: 1,
};
// duplicate of imageChannel1 (different part names)
export const imageChannel2 = {
  ...imageChannel2Import,
  channelId: "channel-image-2",
  gain: 1,
};

///////////////////////////////////////
// de/normalized payload for actions //
///////////////////////////////////////

export const denormImageChannel1Import = {
  ...imageChannel1Import,
  parts: [part1, part2]
};

export const denormImageChannel1 = {
  ...imageChannel1,
  parts: [part1, part2]
};

// normalized payloads during creation

export const normalizedPart1 = {
  entities: {
    byPartId: {
      [part1.partId]: part1,
    }
  },
  result:
    part1.partId
};
export const normalizedPart2 = {
  entities: {
    byPartId: {
      [part2.partId]: part2,
    }
  },
  result:
    part2.partId
};
export const normalizedPart3 = {
  entities: {
    byPartId: {
      [part3.partId]: part3,
    }
  },
  result:
    part3.partId
};
export const normalizedPart4 = {
  entities: {
    byPartId: {
      [part4.partId]: part4,
    }
  },
  result:
    part4.partId
};


// with 2 parts
export const normalizedPart12 = {
  entities: {
    byPartId: {
      [part1.partId]: part1,
      [part2.partId]: part2
    }
  },
  result:
    [part1.partId, part2.part1]
};

// normalied channels
export const normalizedImageChannel0 = {
  entities: {
    byChannelId: {
      [imageChannel1.channelId]: imageChannel0,
    }
  },
  result: imageChannel0.channelId
};

export const normalizedImageChannel1 = {
  entities: {
    byChannelId: {
      [imageChannel1.channelId]: imageChannel1,
    }
  },
  result: imageChannel1.channelId
};

// copied normalizedImageChannel1
export const normalizedImageChannel2 = {
  entities: {
    byChannelId: {
      [imageChannel2.channelId]: imageChannel2,
    }
  },
  result: imageChannel2.channelId
};

//////////////////////
// resulting states //
//////////////////////

export const imageChannelState1 = {
  byChannelId: {
    [imageChannel1.channelId]: imageChannel1,
  },
  allChannelIds: [imageChannel1.channelId],
  activeChannels: [],
  playingChannels: [],
};

export const partState1 = {
  byPartId: {
    [part1.partId]: part1,
  },
  allPartIds: [part1.partId],
};
export const partState2 = {
  byPartId: {
    [part1.partId]: part1,
    [part2.partId]: part2,
  },
  allPartIds: [part1.partId, part2.partId],
};

export const entityState0 = {
  entities: {
    ...initialEntityState
  },
  view: {
    resolution: 80,
  }
};

export const entityState1 = {
  entities: {
    ...initialEntityState,
    channels: imageChannelState1,
    parts: partState2,
  },
  view: {
    resolution: 80,
  }
};
