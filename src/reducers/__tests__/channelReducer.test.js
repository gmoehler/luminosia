import reducer from '../channelReducer';
import * as types from '../../actions/types';
import { audioChannel, imageChannel } from '../../__fixtures__/channel.fixtures';

describe('channel reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        byId: {},
        lastChannelId: -1
      }
    )
  })

  it('should handle ADD_CHANNEL for an audio channel', () => {
    expect(
      reducer(reducer(undefined, {}), {
        type: types.ADD_CHANNEL,
        payload: audioChannel
      })
    ).toEqual({
      byId: {
        0: {
          ...audioChannel,
          id: 0,
          lastPartId: -1,
        }
      },
      lastChannelId: 0,

    })
  })

  it('should handle ADD_CHANNEL for an image channel', () => {
    expect(
      reducer(reducer(undefined, {}), {
        type: types.ADD_CHANNEL,
        payload: imageChannel
      })
    ).toEqual({
      byId: {
        0: {
          ...imageChannel,
          id: 0,
          lastPartId: -1, // update is done by action not reducer
        }
      },
      lastChannelId: 0,

    })
  })


})