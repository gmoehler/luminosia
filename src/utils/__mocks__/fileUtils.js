// mocks the fileUtils

let sampleRate = 48000;
let duration = 12.0;

// mock setup

export function setSampleRate(sr) {
  sampleRate = sr;
}

export function setDuration(dur) {
  duration = dur;
}

// API

export function readAudioFile(file, audioContext) {
  return Promise.resolve({
    sampleRate,
    duration
  });
}

