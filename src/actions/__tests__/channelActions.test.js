import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../channelActions";
import * as types from "../types";
import { imageChannelState, normalizedPart } from "../../__fixtures__/channel.fixtures";

import { initialState as initialViewState } from "../../reducers/viewReducer";

import * as fileUtilsMock from "../../utils/fileUtils";
jest.mock("../../utils/fileUtils");

export const mockStore = configureMockStore([thunk]);

describe("actions", () => {

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
          channelId: "channel-1",
          type: "audio",
          playState: "stopped",
          src: audioFile.name,
          offset: 0,
          gain: 1,
          sampleRate: 44100,
          buffer: {
            duration: 21.21,
            sampleRate: 44100,
          },
          duration: 21.21,
          active: true,
          parts: [],
        }
      },
      {
        type: types.ADD_A_CHANNEL,
        payload: {
          entities: {
            byChannelId: {
              "channel-1": {
                channelId: "channel-1",
                type: "audio",
                playState: "stopped",
                src: audioFile.name,
                offset: 0,
                gain: 1,
                sampleRate: 44100,
                buffer: {
                  duration: 21.21,
                  sampleRate: 44100,
                },
                duration: 21.21,
                active: true,
                parts: [],
              }
            }
          },
          result: "channel-1",
        }
      },
      {
        type: types.SET_A_CHANNEL_ACTIVE,
        payload: "channel-1",
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

  xit("should add part and markers", () => {

    const state = {
      ...imageChannelState,
      view: initialViewState,
      images: {
        byImageId: {
          "image-1": {
            duration: 11.21
          }
        }
      }
    };

    const store = mockStore(state);
    const partWithChannelId = {
      channelId: 2,
      partId: "part-1",
      offset: 23,
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
        type: types.ADD_A_PART,
        payload: normalizedPart
      },
      {
        type: types.SET_MARKER,
        payload: {
          markerId: "2:2-l",
          partId: "2:2",
          channelId: 2,
          pos: 3.3,
          type: "normal"
        }
      },
      {
        type: types.SET_MARKER,
        payload: {
          markerId: "2:2-r",
          partId: "2:2",
          channelId: 2,
          pos: 3.3 + 11.21,
          type: "normal"
        }
      },
      {
        type: types.SELECT_IMAGE_CHANNEL,
        payload: {
          channelId: 2,
          partId: "2:2",
          selected: true,
        }
      },
      {
        type: types.CLEAR_SEL
      },
      {
        type: types.ADD_ELEMENT_TO_SEL,
        payload: {
          partId: "2:2",
          selected: true,
        }
      },
      {
        type: types.UPDATE_MARKER,
        payload: {
          markerId: "2:2-l",
          type: "selected"
        }
      },
      {
        type: types.UPDATE_MARKER,
        payload: {
          markerId: "2:2-r",
          type: "selected"
        }
      },
    ];

    store.dispatch(actions.insertNewPart(partWithChannelId));
    const acts = store.getActions();
    expect(acts).toMatchObject(expectedActions);
  });

});
