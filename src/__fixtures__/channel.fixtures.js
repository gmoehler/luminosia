export const audioChannelPayload = {
  src: 'some source.mp3',
  type: 'audio',
  offset: 2.0,
  buffer: {
    length: 10,
  // real channels have more fields here
  }
};

export const imageChannelPayload = {
  type: 'image',
  sampleRate: 100,
  selected: false,
  duration: 55.5,
  pyParts: {
    "2": {
      length: 10,
      imageId: "Regenbogenraus.png",
      src: "data:image/png;base64",
      offset: 0.75,
      duration: 1.9125
    }
  }
};

export const initialImageChannelPayload = {
  type: 'image',
  sampleRate: 100,
  selected: true,
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
        selected: true,
        lastPartId: 1,
        byPartId: {
          1: {
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
  offset: 5.5,
  duration: 55.55,
  sampleRate: 100,
};