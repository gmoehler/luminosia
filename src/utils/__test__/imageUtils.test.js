import * as utils from "../imageUtils";

describe("image utils", () => {
  it("should runtime encode and decode correctly", () => {
    const data = [
    0,0,0,0, 1,1,1,0,
    1,2,254,0, 1,3,44,0,
    1,2,254,0, 1,3,44,0,
    1,2,254,0, 0,0,0,0,
    ];
    const img = { 
    	width: 2,
    	height: 4,
    	data
    };
    
    const encodedImg = utils.runtimeEncodeImage(img);
    const finalImg = utils.runtimeDecodeImage(encodedImg);
    
    expect( Array.from(finalImg)).toEqual(img.data);
  });
});
