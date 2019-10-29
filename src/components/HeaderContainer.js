import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Header from "./Header";

import {
  playChannelAndImage, setAChannelActive,
  unsetAChannelActive, createAnImageChannel, stopAllChannels
} from "../actions/channelActions";
import { saveShow, loadShowFromFile, updateFirmware, loadAudioFromFile } from "../actions/ioActions";
import { setResolution } from "../actions/viewActions";
import { deleteSelectedEntities, copyParts, pasteParts, } from "../actions/entityActions";

import { getAllChannelIds, allChannelsStopped } from "../reducers/channelReducer";
import { anyEntitySelected, getEntitiesIdsToCopy } from "../reducers/entityReducer";

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
      <Header { ...this.props }
        zoomIn={ this.zoomIn }
        zoomOut={ this.zoomOut } />
    );
  }
}

const mapStateToProps = state => ({
  channelIds: getAllChannelIds(state),
  entitySelected: anyEntitySelected(state),
  hasPartsToCopy: (getEntitiesIdsToCopy(state).length > 0),
  enablePlay: Boolean(getAllChannelIds(state).length > 0 && allChannelsStopped(state)),
  enableStop: Boolean(getAllChannelIds(state).length && !allChannelsStopped(state)),
});

const mapDispatchToProps = dispatch => ({
  saveShow: () => dispatch(saveShow()),
  loadShowFromFile: (showFile) => dispatch(loadShowFromFile(showFile)),
  loadAudioFromFile: (audioFile) => dispatch(loadAudioFromFile(audioFile, audioContext)),
  createImageChannel: () => dispatch(createAnImageChannel()),
  playChannelAndImage: (channelId) => dispatch(playChannelAndImage(channelId)),
  stopChannel: () => dispatch(stopAllChannels()),
  setResolution: (resolution) => dispatch(setResolution(resolution)),
  deleteSelectedEntities: () => dispatch(deleteSelectedEntities()),
  setChannelActive: (channelId) => dispatch(setAChannelActive(channelId)),
  unsetChannelActive: (channelId) => dispatch(unsetAChannelActive(channelId)),
  copyParts: () => dispatch(copyParts()),
  pasteParts: () => dispatch(pasteParts()),
  updateFirmware: () => dispatch(updateFirmware()),
});

HeaderContainer.propTypes = {
  setResolution: PropTypes.func.isRequired,
  deleteSelectedEntities: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
