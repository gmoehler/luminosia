import React, { Component } from 'react';
import styled /*, { withTheme } */ from 'styled-components';

const ChannelControlWrapper = styled.div`
  display: flex
  justify-content: center;
  flex-direction: column;
  margin: 0;
  padding: 20px;
`;

const ChannelControlRow = styled.div`
  display: flex
  justify-content: center;
  margin: 0;
  padding: 6px;
`;


export default class ChannelControl extends Component {

  uploadConfigFile = (evt) => {
    evt.preventDefault();
    this.props.uploadConfigFile(this.uploadInput.files[0]);
  };

  render() {

    return (
      <ChannelControlWrapper>
        <ChannelControlRow>
        <button onClick={ this.props.init }>Init</button>
        <button onClick={ this.props.downloadConfig }>Download config</button>
        <button onClick={ this.props.deleteSelectedPart }>Delete selected</button>
        </ChannelControlRow>
        <ChannelControlRow>
          <form onSubmit={this.uploadConfigFile}>
            <input ref={(ref) => this.uploadInput = ref } type="file" />
            <button>Upload config</button>
          </form>
        </ChannelControlRow>
        <ChannelControlRow>
        <button onClick={ this.props.playChannel }>Play</button>
        <button onClick={ this.props.stopChannel }>Stop</button>
        <button onClick={ this.props.zoomIn }>Zoom in</button>
        <button onClick={ this.props.zoomOut }>Zoom out</button>
        <select onChange={ this.props.setMode }>
          <option value="moveMode">Move mode</option>
          <option value="selectionMode">Selection mode</option>
        </select>
        </ChannelControlRow>
      </ChannelControlWrapper>
      );
  }
}

// export const ChannelControlWithTheme = withTheme(ChannelControl);