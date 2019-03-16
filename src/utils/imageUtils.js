
export function encodeImage(a) {
  return runtimeEncodeImage(a);
  // return encodeImagePlain(a);
}

export function runtimeEncodeImage(a) {

  // console.log("Start encoding...", a);

  const buffer = new ArrayBuffer(3 + 4 * a.width * a.height); // max size when every pixel was different
  const output = new Uint8Array(buffer);

  let o = 0; // start index in output array
  let cnt = 0; // number of pixel with same value
  let prev = [-1, -1, -1]; // remember prev value

  // output header: encoding-id(1), width, height
  output[o++] = 1;
  output[o++] = a.height;
  output[o++] = a.width;

  for (let col = 0; col < a.width; col++) {
    // initialize prev value with first value of column
    // console.log("col: ", col);
	const idx = 4*col;
    prev = [a.data[idx], a.data[idx+1], a.data[idx+2]];
    cnt = 1; // runtime count
    // console.log("first val: ", prev);

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
        // console.log(`save val: ${prev}, ${cnt}`);

        // remember current value as prev value
        prev = [a.data[s], a.data[s+1], a.data[s+2]];
        // console.log("new val: ", prev);
        cnt = 1; // reset runtime count
      }
    }

    // end of column: output last value with count
    output[o++] = prev[0];
    output[o++] = prev[1];
    output[o++] = prev[2];
    output[o++] = cnt;
    // console.log(`save val: ${prev}, ${cnt}`);
  }
  console.log(`orig size: ${a.width}x${a.height}: ${3*a.width*a.height} bytes`);
  console.log(`enc. size: ${o} bytes, reduction: ${100-Math.round(100*o/(3*a.width*a.height))}%`);
  return output.subarray(0, o);
}

export function runtimeDecodeImage(a) {

  // console.log("Start decoding...", a);
  // input index
  let i = 0;
  // runtime count
  let cnt = 0;

  // read header
  if (a[i++] !== 1) {
    throw new Error("image not runtime encoded");
  }
  const height = a[i++];
  const width = a[i++];
  // console.log(`${width}x${height}`);

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
     //  console.log(`${col},${row}-${o}: out ${output.subarray(o, o+4)}`);
      cnt++;

      // use next input value
      if (cnt === a[i+3]){
        i+=4;
        cnt = 0;
      }
    }
  }
  return output;
}

export function encodeImagePlain(a) {
  const buffer = new ArrayBuffer(3 + 3 * a.width * a.height);
  const output = new Uint8Array(buffer);

  // output header: encoding-id(1), width, height
  output[0] = 0;
  output[1] = a.height;
  output[2] = a.width;

  for (let col = 0; col < a.width; col++) {
    for (let row = 0; row < a.height; row++) {
      // convert row-based to column-based, skipp transparency (4th bit)
      // s: start index in input array
      // input has r-g-b-transp values
      const s = 4 * (row * a.width + col);
      // o: start index in output array
      const o = 3 + 3 * (col * a.height + row);
      output[o] = a.data[s];
      output[o+1] = a.data[s+1];
      output[o+2] = a.data[s+2];
    }
  }
  return output;
}