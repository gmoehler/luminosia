import reducer from "../channelPartReducer";
import { initialState } from "../channelPartReducer";

import * as types from "../../actions/types";
import { partPayload0, partPayload1, partState0, partState1 } from "../../__fixtures__/part.fixtures";

describe("channel reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should handle ADD_PART", () => {
  	const reducer0 = reducer(reducer(undefined, {}), {
          type: types.ADD_PART,
          payload: partPayload0
        });
  
    expect( reducer0).toEqual(partState0);
  });

  it("should handle UPDATE_PART", () => {
  	
  const reducer0 = reducer(reducer(undefined, {}), {
          type: types.ADD_PART,
          payload: partPayload0
        });
  
    expect( reducer0).toEqual(partState0);
    
    const reducer1 = reducer(reducer0, {
          type: types.UPDATE_PART,
          payload: partPayload1
        });
        
    expect( reducer1 ).toEqual(partState1);
  });


});