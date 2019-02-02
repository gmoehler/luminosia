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

})
