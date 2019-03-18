import React, { Component } from "react";
import PropTypes from "prop-types";
import styled /*, { withTheme } */ from "styled-components";
import { withStyles } from "@material-ui/core/styles";
import { Tooltip, IconButton } from "@material-ui/core";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import DeleteIcon from "@material-ui/icons/Delete";
import DownloadConfigIcon from "@material-ui/icons/GetApp";
import UploadConfigIcon from "@material-ui/icons/Publish";
import UploadAudioChannelIcon from "@material-ui/icons/QueueMusic";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";

const HeaderWrapper = styled.div`
  display: flex
  justify-content: center;
  flex-direction: row;
  margin: 0;
  padding: 0 30px;
  white-space: nowrap;
`;

const styles = theme => ({
  root: {
    color: "white",
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 80,
  },
  controlgroup: {
    padding: "0 30",
  }
});

export class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      channelId: "",
    };
  }

  componentDidUpdate() {
    if (this.state.channelId && !this.props.channelIds.includes(this.state.channelId)) {
      this.setState({
        channelId: this.props.channelIds[0]
      });
    }
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


  render() {

    const { createImageChannel, downloadConfig, enablePlay, playChannelAndImage, enableStop, stopChannel, zoomIn, zoomOut, selectedImageOrPart, deleteSelectedPart } = this.props;

    return (
      <HeaderWrapper>
        <div style={ { margin: "0 10px" } }>
          <input type="file"
accept="audio/*"
hidden
ref={ (fileUpload) => this.fileUpload = fileUpload }
onChange={ this.uploadAudioFile }
width={ 0 } />
          <Tooltip title="Load audio">
            <IconButton color="inherit"
onClick={ () => this.fileUpload.click() }>
              <UploadAudioChannelIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add image channel">
            <IconButton color="inherit"
onClick={ createImageChannel }>
              <PlaylistAddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Load show">
            <IconButton color="inherit"
onClick={ () => this.showUpload.click() }>
              <UploadConfigIcon />
            </IconButton>
          </Tooltip>
          <input type="file"
hidden
ref={ (showUpload) => this.showUpload = showUpload }
onChange={ this.uploadConfigFile }
width={ 0 } />
          <Tooltip title="Download show">
            <IconButton color="inherit"
onClick={ downloadConfig }>
              <DownloadConfigIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div style={ { margin: "0 10px" } }>
          <Tooltip title="Play">
            <IconButton color="inherit"
disabled={ !enablePlay }
onClick={ () => playChannelAndImage(this.state.channelId) }>
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Stop">
            <IconButton color="inherit"
disabled={ !enableStop }
onClick={ stopChannel }>
              <StopIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div style={ { margin: "0 10px" } }>
          <Tooltip title="Zoom in">
            <IconButton color="inherit"
onClick={ zoomIn }>
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom out">
            <IconButton color="inherit"
onClick={ zoomOut }>
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete selected">
            <IconButton disabled={ !selectedImageOrPart }
color="inherit"
onClick={ deleteSelectedPart }>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      </HeaderWrapper>
      );
  }
}

Header.propTypes = {
  channelIds: PropTypes.array,
  createImageChannel: PropTypes.func.isRequired,
  downloadConfig: PropTypes.func.isRequired,
  enablePlay: PropTypes.bool.isRequired,
  playChannelAndImage: PropTypes.func.isRequired,
  enableStop: PropTypes.bool.isRequired,
  stopChannel: PropTypes.func.isRequired,
  playChannelAndImageAction: PropTypes.func,
  stopChannelAction: PropTypes.func,
  zoomIn: PropTypes.func.isRequired,
  zoomOut: PropTypes.func.isRequired,
  selectedImageOrPart: PropTypes.object,
  deleteSelectedPart: PropTypes.func.isRequired,
  uploadConfigFile: PropTypes.func.isRequired,
  deselectChannel: PropTypes.func.isRequired,
  selectChannel: PropTypes.func.isRequired,
  uploadAudioFile: PropTypes.func.isRequired,
};

export default withStyles(styles, {
  withTheme: true
})(Header);

// export const HeaderWithTheme = withTheme(Header);