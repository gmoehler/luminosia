

export function encodeImage(a) {
  const buffer = new ArrayBuffer(3 * a.width * a.height);
  const output = new Uint8Array(buffer);
  for (let col = 0; col < a.width; col++) {
    for (let row = 0; row < a.height; row++) {
      // convert row-based to column-based, skipp transparency (4th bit)
      // s: start index in input array
      const s = 4 * (row * a.width + col);
      // o: start index in output array
      const o = 3 * (col * a.height + row);
      output[o] = a.data[s];
      output[o+1] = a.data[s+1];
      output[o+2] = a.data[s+2];
    }
  }
  return output;
}