import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../viewActions";
import * as channelActions from "../channelActions";

import * as types from "../types";
import { imageChannelState, part } from "../../__fixtures__/channel.fixtures";
import { initialState as initialViewState } from "../../reducers/viewReducer";

export const mockStore = configureMockStore([thunk]);

it("should add a part to the clipboard", () => {

  const partWithChannelId = {
    ...part,
    channelId: 2,
  };

  const expectedAction = {
    type: types.COPY_PART,
  };

  expect(actions.copyPart(partWithChannelId)).toEqual(expectedAction);
});

it("should paste a part from channel 2 to channel 1", () => {

  const state = {
    ...imageChannelState,
    view: {
      ...initialViewState,
      partsToCopy: [
        part
      ],
      selectedImageChannelId: 1,
    }
  };

  const store = mockStore(state);

  const expectedActions = [{
    type: types.DELETE_MARKER,
    payload: {
      markerId: "insert"
    }
  }, {
    type: types.ADD_PART,
    payload: {
      ...part,
      channelId: 1
    }
  }, {
    type: types.SET_MARKER,
    payload: {
      "channelId": 1,
      "markerId": "1:2-l",
      "minPos": 0,
      "partId": "1:2",
      "pos": 3.3,
      "type": "normal",
    }
  }, {
    type: types.SET_MARKER,
    payload: {
      "channelId": 1,
      "markerId": "1:2-r",
      "minPos": 11.21,
      "partId": "1:2",
      "pos": 11.21 + 3.3,
      "type": "normal",
    }
  }, {
    type: types.SELECT_IMAGE_CHANNEL,
    payload: {
      channelId: 1,
      partId: "1:2",
      selected: true
    }
  }, {
    type: types.CLEAR_SEL
  }, {
    type: types.ADD_ELEMENT_TO_SEL,
    payload: {
      channelId: 1,
      partId: "1:2",
      selected: true
    }
  }, {
    type: types.UPDATE_MARKER,
    payload: {
      incr: undefined,
      markerId: "1:2-l",
      pos: undefined,
      type: "selected"
    }
  }, {
    type: types.UPDATE_MARKER,
    payload: {
      incr: undefined,
      markerId: "1:2-r",
      pos: undefined,
      type: "selected"
    }
  }
  ];

  store.dispatch(channelActions.pastePart(part));
  const acts = store.getActions();
  expect(acts).toEqual(expectedActions);

});