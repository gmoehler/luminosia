 import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../viewActions";
import { pastePart } from "../channelActions";

import * as types from "../types";
import { part } from "../../__fixtures__/channel.fixtures";
import { initialState as initialViewState } from "../../reducers/viewReducer";

it("should add a part to the clipboard", () => {
 	
 const partWithChannelId = {
      ...part,
      channelId: 2,
    };
 
    const expectedAction = {
      type: types.COPY_PART,
      payload: partWithChannelId
    };
    
    expect(actions.copyPart(partWithChannelId)).toEqual(expectedAction);
  });
  
it("should paste a part from the clipboard", () => {
 	
 
 const state = {
      ...imageChannelState,
      view: {
		...initialViewState,
		selectedElementsById: {
			part[partId]:part
          }
        }
    };

 const store = mockStore(state);
 const partWithChannelId = {
      ...part,
      channelId: 2,
    };
 
    const expectedAction = {
      type: types.ADD_PART,
      payload: partWithChannelId
    };
    
    expect(actions.pastePart(partWithChannelId)).toEqual(expectedAction);
  });