import Loader from './Loader';

export default class extends Loader {

  /**
   * Loads an audio file via XHR.
   */
  load() {

    const that = this;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', that.src, true);
      xhr.responseType = 'arraybuffer';
      xhr.send();

      xhr.addEventListener('progress', (e) => {
        super.fileProgress(e);
      });

      xhr.addEventListener('load', (e) => {
        const decoderPromise = super.fileLoad(e);

        decoderPromise
          .catch(err => reject(err))
          .then((channelBuffer) => {
            resolve(channelBuffer);
          })
          .catch(err => reject(err));
      });

      xhr.addEventListener('error', () => {
        reject(Error(`Track ${that.src} failed to load`));
      });
    });
  }
}
