// pixel: pixel on screen
// sample: value in image / audio
// sampleRate: samples / sec
// resolution: pixels / sample
// zoom level / pixelsPerSecond: pixels / sec
// => 
// resolution = sampleRate / pixelsPerSecond

export function samplesToSeconds(samples, sampleRate) {
  return samples / sampleRate;
}

export function secondsToSamples(seconds, sampleRate) {
  return Math.ceil(seconds * sampleRate);
}

export function samplesToPixels(samples, resolution) {
  return Math.floor(samples / resolution);
}

export function pixelsToSamples(pixels, resolution) {
  return Math.floor(pixels * resolution);
}

export function pixelsToSeconds(pixels, resolution, sampleRate) {
  return (pixels * resolution) / sampleRate;
}

export function secondsToPixels(seconds, resolution, sampleRate) {
  return Math.ceil((seconds * sampleRate) / resolution);
}
