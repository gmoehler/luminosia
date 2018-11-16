import React, { Component } from 'react';
import AudioGroup from './AudioGroup';
import styled /*, { withTheme } */ from 'styled-components';

const AudioWrapper = styled.div`
  displayName: 'AudioWrapper'
  name: AudioWrapper
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

export default class AudioContent extends Component {

  render() {

    return (
      <AudioWrapper >
        <AudioControlWrapper>
          <button onClick={this.props.loadAudio}>Load audio</button>
          <button onClick={this.props.playAudio}>Play audio</button>
          <button onClick={this.props.stopAudio}>Stop audio</button>
        </AudioControlWrapper>
        <AudioGroup
          {...this.props} />
      </AudioWrapper>
      );
  }
}

// export const AudioContentWithTheme = withTheme(AudioContent);