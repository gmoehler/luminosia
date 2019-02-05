import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from '../channelActions';
import * as types from '../types';
import { audioChannel, imageChannel, initialImageChannel } from '../../__fixtures__/channel.fixtures';

import * as fileUtilsMock from '../../utils/__mocks__/fileUtils';

jest.mock('../../utils/fileUtils');

export const mockStore = configureMockStore([thunk]);



describe('actions', () => {
  it('should add an audio channel', () => {
    const expectedAction = {
      type: types.ADD_CHANNEL,
      payload: audioChannel
    }
    expect(actions.addChannel(audioChannel)).toEqual(expectedAction)
  });
  
  it('should add an image channel', () => {
    const expectedAction = {
      type: types.ADD_CHANNEL,
      payload: imageChannel
    }
    expect(actions.addChannel(imageChannel)).toEqual(expectedAction)
  });

  it('should create an initial image channel', () => {
    const expectedActions = [{
        type: types.ADD_CHANNEL,
        payload: initialImageChannel
    }];

    const store = mockStore({
      channel: {
        byId: {},
        lastChannelId: -1
      }
    });
    store.dispatch(actions.createImageChannel());
    const acts = store.getActions();
    expect(acts).toEqual(expectedActions);

  });

  it('should delete a channel', () => {
    const expectedAction = {
      type: types.DELETE_CHANNEL,
      payload: 2
    }
    expect(actions.deleteChannel(2)).toEqual(expectedAction)
  });

  it('should clear all channels', () => {
    const expectedAction = {
      type: types.CLEAR_CHANNELS
    }
    expect(actions.clearChannels()).toEqual(expectedAction)
  });

  it('should select a channel', () => {
    const expectedAction = {
      type: types.SELECT_CHANNEL,
      payload: 2
    }
    expect(actions.selectChannel(2)).toEqual(expectedAction)
  });

  it('should deselect a channel', () => {
    const expectedAction = {
      type: types.DESELECT_CHANNEL,
      payload: 2
    }
    expect(actions.deselectChannel(2)).toEqual(expectedAction)
  });


it('should upload an audio file and create channel', () => {

  fileUtilsMock.setSampleRate(44100);
  fileUtilsMock.setDuration(21.21);
  const store = mockStore({
    channel: {
      byId: {},
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
        selected: true,
      }
    },
    {
      type: types.UPLOAD_AUDIO_SUCCESS
    },

  ]

  const audioContext = {};
  return store.dispatch(actions.uploadAudioFile(audioFile, audioContext))
    .then(() => {
      const acts = store.getActions();
      return expect(acts).toEqual(expectedActions);
    })
  });



})
