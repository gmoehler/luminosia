// single entities

export const part1WithoutId = {
  imageId: "image1.png",
  channelId: "channel-1",
  offset: 1,
  duration: 1,
};

export const part1 = {
  ...part1WithoutId,
  partId: "part-1",
};

export const part2 = {
  partId: "part-2",
  imageId: "image2.png",
  channelId: "channel-1",
  offset: 2,
  duration: 2,
};

// image channel without parts
export const imageChannel0 = {
  channelId: "channel-1",
  type: "image",
  sampleRate: 100,
  duration: 10,
  gain: 1,
  parts: []
};

// only those things stored externally
export const imageChannel1Import = {
  type: "image",
  sampleRate: 100,
  duration: 55.5,
  gain: 1,
  parts: ["part-1", "part-2"]
};

// add things added by action
export const imageChannel1 = {
  ...imageChannel1Import,
  channelId: "channel-1",
  gain: 1,
};

// normalized payload for actions

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

// resulting states

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

export const entityState1 = {
  entities: {
    channels: imageChannelState1,
    parts: partState2,
  }
};

