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
        <button onClick={ this.props.loadAudio }>Load</button>
        <button onClick={ this.props.playChannel }>Play</button>
        <button onClick={ this.props.stopChannel }>Stop</button>
      </AudioControlWrapper>
      );
  }
}

// export const AudioControlWithTheme = withTheme(AudioControl);