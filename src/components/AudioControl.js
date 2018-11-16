import React, { Component } from 'react';
import styled /*, { withTheme } */ from 'styled-components';

const AudioControlWrapper = styled.div`
  display: flex
  justify-content: center;
  margin: 0;
  padding: 20px;
`;

export default class AudioControl extends Component {

  render() {

    return (
        <AudioControlWrapper>
          <button onClick={this.props.loadAudio}>Load audio</button>
          <button onClick={this.props.playAudio}>Play audio</button>
          <button onClick={this.props.stopAudio}>Stop audio</button>
        </AudioControlWrapper>
      );
  }
}

// export const AudioControlWithTheme = withTheme(AudioControl);