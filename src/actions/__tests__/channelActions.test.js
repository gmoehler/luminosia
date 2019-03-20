import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../channelActions";
import * as types from "../types";
import { audioChannelPayload, imageChannelPayload, initialImageChannelPayload, imageChannelState, part } from "../../__fixtures__/channel.fixtures";

import { initialState as initialViewState } from "../../reducers/viewReducer";

import * as fileUtilsMock from "../../utils/fileUtils";
jest.mock("../../utils/fileUtils");

export const mockStore = configureMockStore([thunk]);

describe("actions", () => {
  it("should add an audio channel", () => {
    const expectedAction = {
      type: types.ADD_CHANNEL,
      payload: audioChannelPayload
    };
    expect(actions.addChannel(audioChannelPayload)).toEqual(expectedAction);
  });

  it("should add an image channel", () => {
    const expectedAction = {
      type: types.ADD_CHANNEL,
      payload: imageChannelPayload
    };
    expect(actions.addChannel(imageChannelPayload)).toEqual(expectedAction);
  });

  it("should create an initial image channel", () => {
    const expectedActions = [{
      type: types.ADD_CHANNEL,
      payload: initialImageChannelPayload
    }];

    const store = mockStore({
      channel: {
        byChannelId: {},
        lastChannelId: -1
      }
    });
    store.dispatch(actions.createImageChannel());
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);

  });

  it("should delete a channel", () => {
    const expectedAction = {
      type: types.DELETE_CHANNEL,
      payload: 2
    };
    expect(actions.deleteChannel(2)).toEqual(expectedAction);
  });

  it("should clear all channels", () => {
    const expectedAction = {
      type: types.CLEAR_CHANNELS
    };
    expect(actions.clearChannels()).toEqual(expectedAction);
  });

  it("should set a channel to active", () => {
    const expectedAction = {
      type: types.SET_CHANNEL_ACTIVE,
      payload: 2
    };
    expect(actions.setChannelActive(2)).toEqual(expectedAction);
  });

  it("should set a channel to inactive", () => {
    const expectedAction = {
      type: types.UNSET_CHANNEL_ACTIVE,
      payload: 2
    };
    expect(actions.unsetChannelActive(2)).toEqual(expectedAction);
  });


  it("should upload an audio file and create channel", () => {

    fileUtilsMock.setSampleRate(44100);
    fileUtilsMock.setDuration(21.21);
    const store = mockStore({
      channel: {
        byChannelId: {},
        lastChannelId: -1
      }
    });
    const audioFile = {
      name: "dummy.mp3"
    };

    const expectedActions = [
      {
        type: types.UPLOAD_AUDIO_STARTED
      },
      {
        type: types.ADD_CHANNEL,
        payload: {
          type: "audio",
          playState: "stopped",
          src: audioFile.name,
          offset: 0,
          sampleRate: 44100,
          buffer: {
            duration: 21.21,
            sampleRate: 44100,
          },
          duration: 21.21,
          active: true,
        }
      },
      {
        type: types.UPLOAD_AUDIO_SUCCESS
      },

    ];

    const audioContext = {};
    return store.dispatch(actions.uploadAudioFile(audioFile, audioContext))
      .then(() => {
        const acts = store.getActions();
        return expect(acts).toEqual(expectedActions);
      });
  });

  it("should update markers for last added channel ", () => {

    const store = mockStore(imageChannelState);
    const expectedActions = [
      {
        type: types.SET_MARKER,
        payload: {
          markerId: "2-1-l",
          channelId: 2,
          partId: 1,
          pos: 3.3,
          minPos: 0,
          type: "normal"
        }
      },
      {
        type: types.SET_MARKER,
        payload: {
          markerId: "2-1-r",
          channelId: 2,
          partId: 1,
          pos: 11.21 + 3.3,
          minPos: 11.21,
          type: "normal"
        }
      },
    ];

    store.dispatch(actions.updateChannelMarkersForLastAddedChannel());
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);
  });


  it("should add part and markers", () => {

    const state = {
      ...imageChannelState,
      view: initialViewState,
    };

    const store = mockStore(state);
    const partWithChannelId = {
      ...part,
      channelId: 2,
    };
    const expectedActions = [
      // commented out lines are not relevant
      {
        type: types.DELETE_MARKER,
        payload: {
          markerId: "insert",
        }
      },
      {
        type: types.ADD_PART,
        payload: {
          ...part,
        //        channelId: 2
        }
      },
      {
        type: types.SET_MARKER,
        payload: {
          markerId: "2-1-l", // should be 2-2-l, but lastPartId not changed in test
          pos: 5.5,
          minPos: 0,
          type: "normal"
        }
      },
      {
        type: types.SET_MARKER,
        payload: {
          markerId: "2-1-r", // should be 2-2-r, but lastPartId not changed in test
          pos: 55.5 + 5.55,
          minPos: 55.55,
          type: "normal"
        }
      },
      {
        type: types.SELECT_PART_OR_IMAGE,
        payload: {
          channelId: 2,
          partId: 1,
          selected: true,
        },
      },
      {
        type: types.SELECT_IMAGE_CHANNEL,
        payload: {
          channelId: 2,
          partId: 1,
          selected: true,
        }
      },
      {
        type: types.UPDATE_MARKER,
        payload: {
          markerId: "2-1-l",
          incr: 0,
          type: "selected"
        }
      },
      {
        type: types.UPDATE_MARKER,
        payload: {
          markerId: "2-1-r",
          incr: 0,
          type: "selected"
        }
      },
    ];

    store.dispatch(actions.insertNewPart(partWithChannelId));
    const acts = store.getActions();
    expect(acts).toMatchObject(expectedActions);
  });

});
