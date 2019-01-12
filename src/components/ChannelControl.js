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
        <button onClick={ this.props.load }>Load</button>
        <button onClick={ this.props.deleteSelectedPart }>Del part</button>
        <button onClick={ this.props.playChannel }>Play</button>
        <button onClick={ this.props.stopChannel }>Stop</button>
        <button onClick={ this.props.zoomIn }>Zoom in</button>
        <button onClick={ this.props.zoomOut }>Zoom out</button>
        <select onChange={ this.props.setMode }>
          <option value="moveMode">Move mode</option>
          <option value="selectionMode">Selection mode</option>
        </select>
      </ChannelControlWrapper>
      );
  }
}

// export const ChannelControlWithTheme = withTheme(ChannelControl);