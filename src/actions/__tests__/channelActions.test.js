import * as actions from '../channelActions';
import * as types from '../types';
import { audioChannel, imageChannel } from '../../__fixtures__/channel.fixtures';

describe('actions', () => {
  it('should create an audio channel', () => {
    const expectedAction = {
      type: types.ADD_CHANNEL,
      payload: audioChannel
    }
    expect(actions.addChannel(audioChannel)).toEqual(expectedAction)
  });
  
  it('should create an image channel', () => {
    const expectedAction = {
      type: types.ADD_CHANNEL,
      payload: imageChannel
    }
    expect(actions.addChannel(imageChannel)).toEqual(expectedAction)
  });
})
