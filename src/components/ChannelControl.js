import React, { Component } from 'react';
import styled /*, { withTheme } */ from 'styled-components';

const ChannelControlWrapper = styled.div`
  display: flex
  justify-content: center;
  margin: 0;
  padding: 20px;
`;

export default class ChannelControl extends Component {

  render() {

    return (
      <ChannelControlWrapper>
        <button onClick={ this.props.loadChannel }>Load</button>
        <button onClick={ this.props.playChannel }>Play</button>
        <button onClick={ this.props.stopChannel }>Stop</button>
      </ChannelControlWrapper>
      );
  }
}

// export const ChannelControlWithTheme = withTheme(ChannelControl);