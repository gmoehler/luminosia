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
  constructor(props) {
    super(props);
    this.selectedChannelId = null;
  }

  uploadConfigFile = (evt) => {
    evt.preventDefault();
    this.props.uploadConfigFile(this.uploadConfigFileInput.files[0]);
  };

  uploadAudioFile = (evt) => {
    evt.preventDefault();
    this.props.uploadAudioFile(this.uploadAudioFileInput.files[0]);
  };

  render() {

    const channelSelection = this.props.channelIds.map((channelId) => 
      <option key={channelId} value={channelId}>{channelId}</option>
    )

    if (this.selectedChannelId) {
      if (this.props.channelIds && !this.props.channelIds.includes(this.selectedChannelId)){
        this.selectedChannelId = this.props.channelIds[0];
      }
    } else {
      this.selectedChannelId =this.props.channelIds ? this.props.channelIds[0] : null;
    }

    return (
      <ChannelControlWrapper>
        <ChannelControlRow>
          <form onSubmit={this.uploadAudioFile}>
            <input ref={(ref) => this.uploadAudioFileInput = ref } type="file" />
            <button>Upload audio</button>
          </form>
        </ChannelControlRow>
        <ChannelControlRow>
          <button onClick={ this.props.addImageChannel }>
          Add image channel
          </button>
          <select 
            onChange={(e) => this.selectedChannelId= e.target.value}>
            {channelSelection}
          </select>
          <button onClick={ () => this.props.exportImageChannel(this.selectedChannelId) }>Export image channel</button>
          <button onClick={ () => this.props.deleteChannel(this.selectedChannelId) }>Delete image channel</button>
        </ChannelControlRow>
        <ChannelControlRow>
        <button onClick={ this.props.downloadConfig }>Download config</button>
        <button onClick={ this.props.saveImagesToStorage }>Save images</button>
        <button onClick={ this.props.loadImagesfromStorage }>Restore images</button>
        <button onClick={ this.props.clearImageList }>Clear images</button>
        <button onClick={ this.props.clearImagesfromStorage }>Clear store</button>
      </ChannelControlRow>
      <ChannelControlRow>
        <form onSubmit={this.uploadConfigFile}>
          <input ref={(ref) => this.uploadConfigFileInput = ref } type="file" />
          <button>Upload config</button>
        </form>
      </ChannelControlRow>
      <ChannelControlRow>
        <button onClick={ this.props.playChannel }>Play</button>
        <button onClick={ this.props.stopChannel }>Stop</button>
        <button onClick={ this.props.deleteSelectedPart }>Delete selected</button>
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