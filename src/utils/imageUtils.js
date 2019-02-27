
export function encodeImage(a) {
  return encodeImagePlain(a);
}

export function runtimeEncodeImage(a) {
  const buffer = new ArrayBuffer(4 * a.width * a.height); // max size when every pixel was different
  const output = new Uint8Array(buffer);

  let o = 0; // start index in output array
  let cnt = 0; // number of pixel with same value
  let prev = [-1, -1, -1]; // remember prev value

  // output header: encoding-id(1), width, height
  output[o++] = 1;
  output[o++] = a.width;
  output[o++] = a.height;

  for (let col = 0; col < a.width; col++) {
    // initialize prev value with first value of column
    console.log("col: ", col);
	const idx = 4*col;
    prev = [a.data[idx], a.data[idx+1], a.data[idx+2]];
    cnt = 1; // runtime count
    console.log("first val: ", prev);

    // start with second value of col
    for (let row = 1; row < a.height; row++) {
      // convert row-based to column-based, skipp transparency (4th bit)
      // s: start index in input array
      const s = 4 * (row * a.width + col);

      //  value === prev value: no output, but increment count
      if (prev[0] ===  a.data[s] &&
        prev[1] ===  a.data[s+1] &&
        prev[2] ===  a.data[s+2]) {
        cnt++;
      } else {
        // new value: output prev value with count
        output[o++] = prev[0];
        output[o++] = prev[1];
        output[o++] = prev[2];
        output[o++] = cnt;
        console.log(`save val: ${prev}, ${cnt}`);

        // remember current value as prev value
        prev = [a.data[s], a.data[s+1], a.data[s+2]];
        console.log("new val: ", prev);
        cnt = 1; // reset runtime count
      }
    }

    // end of column: output last value with count
    output[o++] = prev[0];
    output[o++] = prev[1];
    output[o++] = prev[2];
    output[o++] = cnt;
  }
  return output.subarray(0, o);
}

export function runtimeDecodeImage(a) {

  // input index
  let i = 0;
  // runtime count
  let cnt = 0;

  // read header
  if (a[i++] !== 1) {
    throw new Error("image not runtime encoded");
  }
  const width = a[i++];
  const height = a[i++];

  const buffer = new ArrayBuffer(4 * width * height); 
  const output = new Uint8Array(buffer);

  for (let col = 0; col < width; col++) {
    for (let row = 0; row < height; row++) {
      // output index 
      let o = 4 * (row * width + col);

      output[o] = a[i];
      output[o+1] = a[i+1];
      output[o+2] = a[i+2];
      output[o+3] = 0; // no transparency
      cnt++;

      // use next input value
      if (cnt === a[i+3]){
        i++;
        cnt = 0;
      }
    }
  }
}

export function encodeImagePlain(a) {
  const buffer = new ArrayBuffer(3 * a.width * a.height);
  const output = new Uint8Array(buffer);
  for (let col = 0; col < a.width; col++) {
    for (let row = 0; row < a.height; row++) {
      // convert row-based to column-based, skipp transparency (4th bit)
      // s: start index in input array
      // input has r-g-b-transp values
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