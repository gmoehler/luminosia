import React, { Component } from 'react';
import Channel from './Channel';
import { withPlayContext } from './withPlayContext'
import styled, { withTheme } from 'styled-components';
import { secondsToPixels } from '../utils/conversions';

const AudioWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  margin: 0;
  padding: 20px;
`;

const AudioControlWrapper = styled.div`
  display: flex
  justify-content: center;
  margin: 0;
  padding: 20px;
`;

class AudioGroup extends Component {

  render() {

    const {data, length, bits} = {...this.props.audio.peaks};
    const channelData = Array.isArray(data) ? data[0] : [];
    const progressPx = this.props.audio.buffer ? 
      secondsToPixels(this.props.progress, 1000, this.props.audio.buffer.sampleRate) : 0;

    return (
      <AudioWrapper >
        <AudioControlWrapper>
          <button onClick={this.props.doLoadAudio}>Load audio</button>
          <button onClick={this.props.playAudio}>Play audio</button>
          <button onClick={this.props.stopAudio}>Stop audio</button>
        </AudioControlWrapper>
        <Channel 
          peaks={channelData} 
          length={500}
          progress={progressPx}
          bits={bits} 
          scale={this.props.scale}/>
      </AudioWrapper>
    );
  }
};

export const AudioGroupWithPlay = withTheme(withPlayContext(AudioGroup));

