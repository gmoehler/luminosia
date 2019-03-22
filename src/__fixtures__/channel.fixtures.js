export const audioChannelPayload = {
  src: "some source.mp3",
  type: "audio",
  offset: 2.0,
  buffer: {
    length: 10,
  // real channels have more fields here
  }
};

export const imageChannelPayload = {
  type: "image",
  sampleRate: 100,
  active: false,
  duration: 55.5,
  pyParts: {
    2: {
      length: 10,
      imageId: "Regenbogenraus.png",
      src: "data:image/png;base64",
      offset: 0.75,
      duration: 1.9125
    }
  }
};

export const initialImageChannelPayload = {
  type: "image",
  sampleRate: 100,
  active: true,
  duration: 10,
  playState: "stopped",
};

export const imageChannelState = {
  channel: {
    lastChannelId: 2,
    byChannelId: {
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
  partId: "2:3",
  channelId: 2,
  offset: 5.5,
  duration: 55.55,
  sampleRate: 100,
};

export const part2 = {
  partId: "2:5",
  channelId: 3,
  offset: 5.5,
  duration: 55.55,
  sampleRate: 100,
};