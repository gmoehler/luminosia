export const  audioChannel = { 
	src: 'some source.mp3',
    type: 'audio',
    offset: 2.0,
    buffer: {
    	length: 10,
    	// real channels have more fields here
    }
  }
  
export const  imageChannel = { 
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
  