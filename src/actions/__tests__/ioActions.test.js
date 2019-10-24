import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from "../ioActions";
import * as types from "../types";

import * as fileUtilsMock from "../../utils/fileUtils";
jest.mock("../../utils/fileUtils");

export const mockStore = configureMockStore([thunk]);

describe("io actions", () => {

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
        type: types.LOAD_AUDIO_STARTED
      }, {
        type: types.ADD_A_CHANNEL,
        payload: {
          entities: {
            byChannelId: {
              "channel-audio-1": {
                channelId: "channel-audio-1",
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
          result: "channel-audio-1",
        }
      },
      {
        type: types.SET_A_CHANNEL_ACTIVE,
        payload: "channel-audio-1",
      },
      {
        type: types.LOAD_AUDIO_SUCCESS
      },

    ];

    const audioContext = {};
    return store.dispatch(actions.loadAudioFromFile(audioFile, audioContext))
      .then(() => {
        const acts = store.getActions();
        return expect(acts).toEqual(expectedActions);
      });
  });

});
