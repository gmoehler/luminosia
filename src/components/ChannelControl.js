import React, { Component } from 'react';
import styled /*, { withTheme } */ from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton, FormControl, InputLabel, Select, MenuItem, } from '@material-ui/core';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteChannelIcon from '@material-ui/icons/DeleteSweep';
import DownloadConfigIcon from '@material-ui/icons/GetApp';
import UploadConfigIcon from '@material-ui/icons/Publish';
import UploadAudioChannelIcon from '@material-ui/icons/QueueMusic';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import DownloadChannelIcon from '@material-ui/icons/LowPriority';

const ChannelControlWrapper = styled.div`
  display: flex
  justify-content: center;
  flex-direction: row;
  margin: 0;
  padding: 0 20px;
`;

const styles = theme => ({
  root: {
    color: 'white',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 80,
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

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidUpdate() {
    if (this.state.channelId && !this.props.channelIds.includes(this.state.channelId)){
      this.setState({channelId: this.props.channelIds[0]});
    }
  }

  render() {

    const { classes } = this.props;

    const channelSelections = this.props.channelIds.map((channelId) => 
      <MenuItem key={channelId} value={channelId}>{channelId}</MenuItem>
    )

    return (
      <ChannelControlWrapper>
          <input 
            type="file" 
            accept="audio/*"
            hidden 
            ref={(fileUpload) => this.fileUpload = fileUpload }
            onChange={this.uploadAudioFile} width={0} 
          />
          <Tooltip title="Load audio">
            <IconButton  color="inherit" onClick={() => this.fileUpload.click()}>
              <UploadAudioChannelIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add image channel">
            <IconButton color="inherit" onClick={ this.props.addImageChannel }>
              <PlaylistAddIcon/>
            </IconButton>
          </Tooltip>

          <FormControl color="inherit" className={classes.formControl}>
            <InputLabel htmlFor="channelId-select">Channel</InputLabel>
            <Select 
              value={this.state.channelId}
              onChange={this.handleChange}
              inputProps={{
                name: 'channelId',
                id: 'channelId-select',
              }}
            >
              {channelSelections}
            </Select>
          </FormControl>

          <Tooltip title="Export image channel"
            disabled={!this.state.channelId} >
            <IconButton color="inherit" onClick={ () => this.props.exportImageChannel(this.state.channelId) }>
              <DownloadChannelIcon/>
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete image channel"
            disabled={!this.state.channelId} >
            <IconButton color="inherit" onClick={ () => this.props.deleteChannel(this.state.channelId) }>
              <DeleteChannelIcon/>
            </IconButton>
          </Tooltip>

          <Tooltip title="Download show">
            <IconButton color="inherit" onClick={ this.props.downloadConfig }>
              <DownloadConfigIcon/>
            </IconButton>
          </Tooltip>

          <input 
            type="file" 
            hidden 
            ref={(showUpload) => this.showUpload = showUpload }
            onChange={this.uploadConfigFile} width={0} 
          />
          <Tooltip title="Load show">
            <IconButton  color="inherit" onClick={() => this.showUpload.click()}>
              <UploadConfigIcon />
            </IconButton>
          </Tooltip>

        <Tooltip title="Play"
          disabled={!this.props.enablePlay} >
          <IconButton color="inherit" onClick={ () => this.props.playChannelAndImage(this.state.channelId) }>
            <PlayArrowIcon/>
          </IconButton>
        </Tooltip>

        <Tooltip title="Stop"
          disabled={!this.props.enableStop} >
          <IconButton color="inherit" onClick={ this.props.stopChannel }>
            <StopIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete selected">
          <IconButton disabled={!this.props.selectedImageOrPart} 
            color="inherit" onClick={ this.props.deleteSelectedPart }>
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
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