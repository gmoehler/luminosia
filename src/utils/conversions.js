// sampleRate: samples in image / sound  per second
// resolution: pixels on screen per second (was: pixels per sample)

export function samplesToSeconds(samples, sampleRate) {
  return samples / sampleRate;
}

export function secondsToSamples(seconds, sampleRate, toCeil = true) {
  return toCeil ?
    Math.ceil(seconds * sampleRate) : Math.floor(seconds * sampleRate);
}

export function samplesToPixels(samples, resolution, sampleRate) {
  return Math.floor((samples * resolution) / sampleRate);
}

export function pixelsToSamples(pixels, resolution, sampleRate) {
  return Math.floor((pixels * sampleRate) / resolution);
}

export function pixelsToSeconds(pixels, resolution) {
  return pixels / resolution;
}

export function secondsToPixels(seconds, resolution) {
  return Math.ceil(seconds * resolution);
}

export function secondsToRad(seconds, rotationSpeed) {
  // do not exceed full circle
  const factor = (seconds * rotationSpeed) % 1;
  return 2 * Math.PI * factor;
}

export function samplesToRad(samples, sampleRate, rotationSpeed) {
  // do not exceed full circle
  const factor = (samples * rotationSpeed / sampleRate) % 1;
  return 2 * Math.PI * factor;
}