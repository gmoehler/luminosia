import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actions from '../channelActions';
import * as types from '../types';
import { audioChannel, imageChannel, initialImageChannel } from '../../__fixtures__/channel.fixtures';

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
    const expectedAction = {
        type: types.ADD_CHANNEL,
        payload: initialImageChannel
    }
    const store = mockStore({
      channel: {
        byId: {},
        lastChannelId: -1
      }
    });
    store.dispatch(actions.createImageChannel());
    const acts = store.getActions();
    expect(acts[0]).toEqual(expectedAction);

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
    const expectedAction = {
        type: types.UPLOAD_AUDIO_STARTED,
        payload: initialImageChannel
    }
    const store = mockStore({
      channel: {
        byId: {},
        lastChannelId: -1
      }
    });
    store.dispatch(actions.uploadAudioFile());
    const acts = store.getActions();
    expect(acts[0]).toEqual(expectedAction);

  });



})
