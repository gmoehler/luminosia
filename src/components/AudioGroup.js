import React, { Component } from 'react';
import Channel from './Channel';
import { withPlayContext } from './withPlayContext'
import { secondsToPixels } from '../utils/conversions';

const ChannelWithPlay = withPlayContext(Channel);

export default class AudioGroup extends Component {

  render() {

    const {data, length, bits} = {
      ...this.props.audio.peaks
    };
    const channelData = Array.isArray(data) ? data[0] : [];

    return (
        <ChannelWithPlay peaks={ channelData } length={ 500 } bits={ bits } scale={ this.props.scale } audio={ this.props.audio }
          audioContext={ this.props.audioContext } />
      );
  }
}
;

// export const AudioGroupWithTheme = withTheme(AudioGroup);

