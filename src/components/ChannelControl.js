import React, { Component } from 'react';
import styled /*, { withTheme } */ from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton } from '@material-ui/core';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import DownloadConfigIcon from '@material-ui/icons/GetApp';
import UploadConfigIcon from '@material-ui/icons/Publish';
import UploadAudioChannelIcon from '@material-ui/icons/QueueMusic';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

const ChannelControlWrapper = styled.div`
  display: flex
  justify-content: center;
  flex-direction: row;
  margin: 0;
  padding: 0 30px;
  white-space: nowrap;
`;

const styles = theme => ({
  root: {
    color: 'white',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 80,
  },
  controlgroup: {
    padding: '0 30',
  }
});

export class ChannelControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      channelId: "",
    };
  }

  uploadConfigFile = (evt) => {
    evt.preventDefault();
    this.props.uploadConfigFile(evt.target.files[0]);
  };

  uploadAudioFile = (evt) => {
    evt.preventDefault();
    this.props.uploadAudioFile(evt.target.files[0]);
  };

  handleChannelSelectionChange = event => {
    const channelId = event.target.value;
    if (this.state[event.target.name]) {
      this.props.deselectChannel(this.state[event.target.name]);
    }
    this.props.selectChannel(channelId);
    this.setState({
      [event.target.name]: channelId
    });
  };

  componentDidUpdate() {
    if (this.state.channelId && !this.props.channelIds.includes(this.state.channelId)) {
      this.setState({
        channelId: this.props.channelIds[0]
      });
    }
  }

  render() {

    return (
      <ChannelControlWrapper>
        <div style={ { margin: "0 10px" } }>
          <input type="file" accept="audio/*" hidden ref={ (fileUpload) => this.fileUpload = fileUpload } onChange={ this.uploadAudioFile } width={ 0 } />
          <Tooltip title="Load audio">
            <IconButton color="inherit" onClick={ () => this.fileUpload.click() }>
              <UploadAudioChannelIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add image channel">
            <IconButton color="inherit" onClick={ this.props.createImageChannel }>
              <PlaylistAddIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Load show">
            <IconButton color="inherit" onClick={ () => this.showUpload.click() }>
              <UploadConfigIcon />
            </IconButton>
          </Tooltip>
          <input type="file" hidden ref={ (showUpload) => this.showUpload = showUpload } onChange={ this.uploadConfigFile } width={ 0 } />
          <Tooltip title="Download show">
            <IconButton color="inherit" onClick={ this.props.downloadConfig }>
              <DownloadConfigIcon/>
            </IconButton>
          </Tooltip>
        </div>
        <div style={ { margin: "0 10px" } }>
          <Tooltip title="Play" disabled={ !this.props.enablePlay }>
            <IconButton color="inherit" onClick={ () => this.props.playChannelAndImage(this.state.channelId) }>
              <PlayArrowIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Stop" disabled={ !this.props.enableStop }>
            <IconButton color="inherit" onClick={ this.props.stopChannel }>
              <StopIcon/>
            </IconButton>
          </Tooltip>
        </div>
        <div style={ { margin: "0 10px" } }>
          <Tooltip title="Zoom in">
            <IconButton color="inherit" onClick={ this.props.zoomIn }>
              <ZoomInIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom out">
            <IconButton color="inherit" onClick={ this.props.zoomOut }>
              <ZoomOutIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete selected">
            <IconButton disabled={ !this.props.selectedImageOrPart } color="inherit" onClick={ this.props.deleteSelectedPart }>
              <DeleteIcon/>
            </IconButton>
          </Tooltip>
        </div>
      </ChannelControlWrapper>
      );
  }
}

export default withStyles(styles, {
  withTheme: true
})(ChannelControl);

/*
        <select onChange={ this.props.setMode }>
          <option value="moveMode">Move mode</option>
          <option value="selectionMode">Selection mode</option>
        </select>
        */

// export const ChannelControlWithTheme = withTheme(ChannelControl);