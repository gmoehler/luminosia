import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { stopChannel, uploadAudioFile, playChannelAndImage, setChannelActive, unsetChannelActive, pastePart, createAnImageChannel } from "../actions/channelActions";

import { downloadConfig, uploadConfigFile, uploadConfig, updateFirmware } from "../actions/generalActions";
import { setResolution, copyPart } from "../actions/viewActions";
import { deleteSelectedEntities, } from "../actions/entityActions";
import Header from "./Header";
import { getAllChannelIds, allChannelsStopped } from "../reducers/achannelReducer";
import { getPartsToCopy, } from "../reducers/viewReducer";
import { anyEntitySelected } from "../reducers/entityReducer";

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = window.AudioContext && new window.AudioContext();

const resolutions = [4000, 2000, 1000, 500, 250, 125, 80, 40, 20, 10, 5]; // in pixels / sec
const defaultResolutionIdx = 6;

class HeaderContainer extends Component {

  constructor(props) {
    super(props);
    this.resolutionIdx = defaultResolutionIdx;
  }

  resetZoom = () => {
    this.resolutionIdx = defaultResolutionIdx;
    this.props.setResolution(
      resolutions[this.resolutionIdx]
    );
  }

  zoomIn = () => {
    this.resolutionIdx = Math.min(Math.max(parseInt(this.resolutionIdx) - 1, 0), resolutions.length - 1);
    this.props.setResolution(
      resolutions[this.resolutionIdx]
    );
  }

  zoomOut = () => {
    this.resolutionIdx = Math.min(Math.max(parseInt(this.resolutionIdx) + 1, 0), resolutions.length - 1);
    this.props.setResolution(
      resolutions[this.resolutionIdx]
    );
  }

  render() {

    return (
      <Header { ...this.props } zoomIn={ this.zoomIn } zoomOut={ this.zoomOut } />
    );
  }
}

const mapStateToProps = state => ({
  channelIds: getAllChannelIds(state),
  entitySelected: anyEntitySelected(state),
  hasPartToCopy: Boolean(getPartsToCopy(state)),
  enablePlay: Boolean(getAllChannelIds(state).length > 0 && allChannelsStopped(state)),
  enableStop: Boolean(getAllChannelIds(state).length && !allChannelsStopped(state)),
});

const mapDispatchToProps = dispatch => ({
  downloadConfig: () => dispatch(downloadConfig()),
  uploadConfigFile: (configFile) => dispatch(uploadConfigFile(configFile, audioContext)),
  uploadAudioFile: (audioFile) => dispatch(uploadAudioFile(audioFile, audioContext)),
  uploadConfigAction: (config) => dispatch(uploadConfig(config, audioContext)),
  // createImageChannel: () => dispatch(createImageChannel()),
  createImageChannel: () => dispatch(createAnImageChannel()),
  playChannelAndImage: (channelId) => dispatch(playChannelAndImage(channelId)),
  stopChannel: () => dispatch(stopChannel()),
  setResolution: (resolution) => dispatch(setResolution(resolution)),
  deleteSelectedEntities: () => dispatch(deleteSelectedEntities()),
  setChannelActive: (channelId) => dispatch(setChannelActive(channelId)),
  unsetChannelActive: (channelId) => dispatch(unsetChannelActive(channelId)),
  copyPart: () => dispatch(copyPart()),
  pastePart: () => dispatch(pastePart()),
  updateFirmware: () => dispatch(updateFirmware()),
});

HeaderContainer.propTypes = {
  setResolution: PropTypes.func.isRequired,
  deleteSelectedEntities: PropTypes.func.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
