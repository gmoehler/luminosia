import React, { Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import { Tooltip, IconButton } from "@material-ui/core";
import { ContentCopy, ContentPaste } from "mdi-material-ui";

import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveShowIcon from "@material-ui/icons/SaveAlt";
import LoadShowIcon from "@material-ui/icons/OpenInBrowser";
import UploadAudioChannelIcon from "@material-ui/icons/QueueMusic";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import Autorenew from "@material-ui/icons/Autorenew";

const styles = theme => ({
  root: {
    color: "white",
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    margin: 0,
    padding: "0 30px",
    whiteSpace: "nowrap",
  },
  headergroup: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    margin: "0 10px",
  },
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

  loadShowFromFile = (evt) => {
    evt.preventDefault();
    this.props.loadShowFromFile(evt.target.files[0]);
  };

  loadAudioFromFile = (evt) => {
    evt.preventDefault();
    this.props.loadAudioFromFile(evt.target.files[0]);
  };

  handleChannelSelectionChange = event => {
    const channelId = event.target.value;
    if (this.state[event.target.name]) {
      this.props.setChannelInactive(this.state[event.target.name]);
    }
    this.props.setChannelActive(channelId);
    this.setState({
      [event.target.name]: channelId
    });
  };


  render() {

    const { classes,
      createImageChannel, saveShow, enablePlay, playChannelAndImage, enableStop,
      stopChannel, zoomIn, zoomOut, entitySelected, deleteSelectedEntities,
      copyParts, pasteParts, hasPartsToCopy, updateFirmware } = this.props;

    return (
      <div className={ classes.wrapper }>
        <div className={ classes.headergroup }>

          <Tooltip title="Load audio">
            <IconButton color="inherit"
              onClick={ () => this.fileUpload.click() }>
              <UploadAudioChannelIcon />
            </IconButton>
          </Tooltip>
          <input type="file"
            accept="audio/*"
            hidden
            ref={ (fileUpload) => this.fileUpload = fileUpload }
            onChange={ this.loadAudioFromFile }
            width={ 0 } />

          <Tooltip title="Add image channel">
            <IconButton color="inherit"
              onClick={ createImageChannel }>
              <PlaylistAddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Load show">
            <IconButton color="inherit"
              onClick={ () => this.loadShow.click() }>
              <LoadShowIcon />
            </IconButton>
          </Tooltip>
          <input type="file"
            hidden
            value=""
            ref={ (loadShow) => this.loadShow = loadShow }
            onChange={ this.loadShowFromFile }
            width={ 0 } />

          <Tooltip title="Save show">
            <IconButton color="inherit"
              onClick={ saveShow }>
              <SaveShowIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div className={ classes.headergroup }>
          <Tooltip title="Play">
            <div>
              <IconButton color="inherit"
                disabled={ !enablePlay }
                onClick={ () => playChannelAndImage(this.state.channelId) }>
                <PlayArrowIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip title="Stop">
            <div>
              <IconButton color="inherit"
                disabled={ !enableStop }
                onClick={ stopChannel }>
                <StopIcon />
              </IconButton>
            </div>
          </Tooltip>
        </div>
        <div className={ classes.headergroup }>
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
          <Tooltip title="Copy selected part">
            <div>
              <IconButton disabled={ !entitySelected }
                color="inherit"
                onClick={ copyParts }>
                <ContentCopy />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip title="Paste part">
            <div>
              <IconButton disabled={ !hasPartsToCopy }
                color="inherit"
                onClick={ pasteParts }>
                <ContentPaste />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip title="Delete selected">
            <div>
              <IconButton disabled={ !entitySelected }
                color="inherit"
                onClick={ deleteSelectedEntities }>
                <DeleteIcon />
              </IconButton>
            </div>
          </Tooltip>
        </div>
        <div className={ classes.headergroup }>
          <Tooltip title="Update firmware">
            <IconButton color="secondary"
              onClick={ updateFirmware }>
              <Autorenew />
            </IconButton>
          </Tooltip>

        </div>

      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  channelIds: PropTypes.array,
  createImageChannel: PropTypes.func.isRequired,
  saveShow: PropTypes.func.isRequired,
  enablePlay: PropTypes.bool.isRequired,
  playChannelAndImage: PropTypes.func.isRequired,
  enableStop: PropTypes.bool.isRequired,
  stopChannel: PropTypes.func.isRequired,
  playChannelAndImageAction: PropTypes.func,
  stopChannelAction: PropTypes.func,
  zoomIn: PropTypes.func.isRequired,
  zoomOut: PropTypes.func.isRequired,
  entitySelected: PropTypes.bool,
  deleteSelectedEntities: PropTypes.func.isRequired,
  loadShowFromFile: PropTypes.func.isRequired,
  setChannelInactive: PropTypes.func.isRequired,
  setChannelActive: PropTypes.func.isRequired,
  loadAudioFromFile: PropTypes.func.isRequired,
  copyParts: PropTypes.func.isRequired,
  pasteParts: PropTypes.func.isRequired,
  hasPartsToCopy: PropTypes.bool,
  updateFirmware: PropTypes.func.isRequired,
};

export default withStyles(styles, {
  withTheme: true
})(Header);

// export const HeaderWithTheme = withTheme(Header);