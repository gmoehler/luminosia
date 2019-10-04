// single entities

export const part1 = {
  partId: "part-1",
  imageId: "image1.png",
  channelId: "channel-1",
  offset: 1,
  duration: 1,
};

export const part2 = {
  partId: "part-2",
  imageId: "image2.png",
  channelId: "channel-1",
  offset: 2,
  duration: 2,
};

export const imageChannel1 = {
  channelId: "channel-1",
  type: "image",
  sampleRate: 100,
  active: true,
  duration: 55.5,
  gain: 1,
  playState: "stopped",
  parts: ["part-1", "part-2"]
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
// with 2 parts
export const normalizedPart2 = {
  entities: {
    byPartId: {
      [part1.partId]: part1,
      [part2.partId]: part2
    }
  },
  result:
    [part1.partId, part2.part1]
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

