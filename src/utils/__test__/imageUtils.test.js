import * as utils from "../imageUtils";

describe("image utils", () => {
  it("should runtime encode and decode correctly", () => {
    const data = [
    0,0,0,0, 1,1,1,0,
    1,1,1,0, 1,1,1,0,
    1,1,1,0, 1,1,1,0,
    1,1,1,0, 0,0,0,0,
    ];
    const img = { 
    	width: 2,
    	height: 4,
    	data
    }
    
    const encodedImg = utils.runtimeEncodeImage(img);
    console.log(encodedImg);
    const finalImg = utils.runtimeDecodeImage(encodedImg);
    console.log(finalImg);
    
    expect(finalImg).toEqual(img);
  });
});
