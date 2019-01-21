import React, { Component } from 'react';
import styled /*, { withTheme } */ from 'styled-components';
import Button from '@material-ui/core/Button';
import { Tooltip, IconButton, Icon, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import QueueMusic from '@material-ui/icons/QueueMusic';

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
    this.props.uploadAudioFile(evt.target.files[0]);
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
          <label> Channel actions:</label>
          <input type="file" ref={(fileUpload) => this.fileUpload = fileUpload }
            hidden onChange={this.uploadAudioFile} width={0} />
          <Tooltip title="Load audio">
            <IconButton  color="primary" onClick={() => this.fileUpload.click()}>
              <QueueMusic />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add image channel">
            <IconButton color="primary" onClick={ this.props.addImageChannel }>
              <AddIcon/>
            </IconButton>
          </Tooltip>
          <select 
            onChange={(e) => this.selectedChannelId= e.target.value}>
            {channelSelection}
          </select>
          <Tooltip title="Export image channel">
            <IconButton color="primary" onClick={ () => this.props.exportImageChannel(this.selectedChannelId) }>
              <GetAppIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete image channel">
          <IconButton color="primary" onClick={ () => this.props.deleteChannel(this.selectedChannelId) }>
              <DeleteIcon/>
          </IconButton>
          </Tooltip>
        </ChannelControlRow>
        <ChannelControlRow>
        <Button color="primary" onClick={ this.props.downloadConfig }>Download config</Button>
        <Button color="primary" onClick={ this.props.saveImagesToStorage }>Save images</Button>
        <Button color="primary" onClick={ this.props.loadImagesfromStorage }>Restore images</Button>
        <Button color="primary" onClick={ this.props.clearImageList }>Clear images</Button>
        <Button color="primary" onClick={ this.props.clearImagesfromStorage }>Clear store</Button>
      </ChannelControlRow>
      <ChannelControlRow>
        <form onSubmit={this.uploadConfigFile}>
          <input ref={(ref) => this.uploadConfigFileInput = ref } type="file" />
          <Button color="primary">Upload config</Button>
        </form>
      </ChannelControlRow>
      <ChannelControlRow>
        <Button color="primary" onClick={ this.props.playChannel }>Play</Button>
        <Button color="primary" onClick={ this.props.stopChannel }>Stop</Button>
        <Button color="primary" onClick={ this.props.deleteSelectedPart }>Delete selected</Button>
        <Button color="primary" onClick={ this.props.zoomIn }>Zoom in</Button>
        <Button color="primary" onClick={ this.props.zoomOut }>Zoom out</Button>
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