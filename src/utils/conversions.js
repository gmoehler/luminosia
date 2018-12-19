// sampleRate: samples in image / sound  per second
// resolution: pixels on screen per second (was: pixels per sample)


export function samplesToSeconds(samples, sampleRate) {
  return samples / sampleRate;
}

export function secondsToSamples(seconds, sampleRate) {
  return Math.ceil(seconds * sampleRate);
}

export function samplesToPixels(samples, resolution, sampleRate) {
  return Math.floor((samples * resolution) / sampleRate);
}

export function pixelsToSamples(pixels, resolution, sampleRate) {
  return Math.floor((pixels * sampleRate ) / resolution);
}

export function pixelsToSeconds(pixels, resolution) {
  return pixels / resolution;
}

export function secondsToPixels(seconds, resolution) {
  return Math.ceil(seconds * resolution);
}
