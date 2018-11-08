// import EventEmitter from 'event-emitter';
import { PNG as PNGReader } from 'pngjs';

export const STATE_UNINITIALIZED = 0;
export const STATE_LOADING = 1;
export const STATE_DECODING = 2;
export const STATE_FINISHED = 3;


export default class {
  constructor(src, audioContext) {
    this.src = src;
    this.ac = audioContext;
    this.audioRequestState = STATE_UNINITIALIZED;
  }

  setStateChange(state) {
    this.audioRequestState = state;
    // this.ee.emit('audiorequeststatechange', this.audioRequestState, this.src);
  }

  fileProgress(e) {
    let percentComplete = 0;

    if (this.audioRequestState === STATE_UNINITIALIZED) {
      this.setStateChange(STATE_LOADING);
    }

    if (e.lengthComputable) {
      percentComplete = (e.loaded / e.total) * 100;
    }

    // this.ee.emit('loadprogress', percentComplete, this.src);
  }

  fileLoad(e) {
    const audioData = e.target.response || e.target.result;

    this.setStateChange(STATE_DECODING);
    const that = this;

    return new Promise((resolve, reject) => {
      if (e.target.responseURL.endsWith('png')) {
        const reader = new PNGReader();
        reader.parse(audioData, (err, png) => {
          if (err) {
            reject(err);
          }
          // mimic audioBuffer which has a duration
          resolve(png);
        });
      } else {
        this.ac.decodeAudioData(
          audioData,
          (audioBuffer) => {
            this.audioBuffer = audioBuffer;
            this.setStateChange(STATE_FINISHED);
  
            resolve(audioBuffer);
          },
          (err) => {
            reject(err);
          });
      }
    });
  }
}
