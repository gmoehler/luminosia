import XHRLoader from './XHRLoader';

export default class {
  static createLoader(src, audioContext) {
    if (typeof (src) === 'string') {
      return new XHRLoader(src, audioContext);
    }

    throw new Error('Unsupported src type');
  }
}
