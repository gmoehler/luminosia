import React, { Component } from 'react';
import Channel from './Channel';
import { withAudioContext } from './withAudioContext'

class AudioGroup extends Component {

  render() {

    const {data, length, bits} = {...this.props.peaks};
    const channelData = Array.isArray(data) ? data[0] : [];

    return (
      <div>
        <button onClick={this.props.doLoadAudio}>Load audio</button>
        <button onClick={this.props.playAudio}>Play audio</button>
        <button onClick={this.props.stopAudio}>Stop audio</button>
        <Channel 
          peaks={channelData} 
          length={length} 
          bits={bits} 
          scale={this.props.scale}/>
      </div>
    );
  }
};

export const AudioGroupWithContext = withAudioContext(AudioGroup);
