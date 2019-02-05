export const  audioChannelPayload = { 
	src: 'some source.mp3',
  type: 'audio',
  offset: 2.0,
  buffer: {
    length: 10,
    // real channels have more fields here
  }
}
  
export const  imageChannelPayload = { 
  type: 'image',
  sampleRate: 100,
  selected: false,
  duration: 55.5,
  partsById: {
    "2": {
      length: 10,
      imageId: "Regenbogenraus.png",
      src: "data:image/png;base64",
      offset: 0.75,
      duration: 1.9125
    }
  }
}
  
export const  initialImageChannel = { 
  type: 'image',
  sampleRate: 100,
  selected: true,
  duration: 10,
  playState: "stopped",
}

export const imageChannel = {
  channel: {
    lastChannelId: 2,
    byId: {
      2: {
        id: 2,
        type: "image",
        playState: "stopped",
        sampleRate: 44100,
        duration: 21.21,
        selected: true,
        lastPartId: 1,
        byParts: {
        1: {
          offset: 3.3,
          duration: 11.21,
          sampleRate: 44100,
        }}, // byPartId
    }} // byId
  } // channel
}
