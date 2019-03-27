import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { stopChannel, deleteSelectedPartAndMarkers, createImageChannel, uploadAudioFile, deleteChannel, playChannelAndImage, setChannelActive, unsetChannelActive, pastePart } from "../actions/channelActions";

import { downloadConfig, uploadConfigFile, uploadConfig, exportImageChannel } from "../actions/generalActions";
import { setResolution, copyPart } from "../actions/viewActions";
import Header from "./Header";
import { getChannelIds, allChannelsStopped } from "../reducers/channelReducer";
import { getPartsToCopy, getNumSelectedElements } from "../reducers/viewReducer";

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
    this.props.setResolutionAction(
      resolutions[this.resolutionIdx]
    );
  }

  zoomIn = () => {
    this.resolutionIdx = Math.min(Math.max(parseInt(this.resolutionIdx) - 1, 0), resolutions.length - 1);
    this.props.setResolutionAction(
      resolutions[this.resolutionIdx]
    );
  }

  zoomOut = () => {
    this.resolutionIdx = Math.min(Math.max(parseInt(this.resolutionIdx) + 1, 0), resolutions.length - 1);
    this.props.setResolutionAction(
      resolutions[this.resolutionIdx]
    );
  }

  render() {

    const { channelIds, downloadConfigAction, uploadConfigFileAction, uploadAudioFileAction, deleteSelectedPartAndMarkersAction, 
      createImageChannelAction, exportImageChannelAction, deleteChannelAction, playChannelAndImageAction, stopChannelAction, 
      numSelectedElems, enablePlay, enableStop, setChannelActiveAction, unsetChannelActiveAction, copyPartAction, pastePartAction, hasPartToCopy } = this.props;

    return (
      <Header init={ this.doInit }
          zoomIn={ this.zoomIn }
          zoomOut={ this.zoomOut }
          channelIds={ channelIds }
          downloadConfig={ downloadConfigAction }
          uploadConfigFile={ uploadConfigFileAction }
          uploadAudioFile={ uploadAudioFileAction }
          deleteSelectedPart={ deleteSelectedPartAndMarkersAction }
          createImageChannel={ createImageChannelAction }
          exportImageChannel={ exportImageChannelAction }
          deleteChannel={ deleteChannelAction }
          playChannelAndImage={ playChannelAndImageAction }
          stopChannel={ stopChannelAction }
          numSelectedElems={ numSelectedElems }
          enablePlay={ enablePlay }
          enableStop={ enableStop }
          setChannelActive={ setChannelActiveAction }
          unsetChannelActive={ unsetChannelActiveAction } 
          copyPart={ copyPartAction }
          pastePart={ pastePartAction }
          hasPartToCopy={ hasPartToCopy }
          />
      );
  }
}

const mapStateToProps = state => ({
  channelIds: getChannelIds(state),
  numSelectedElems: getNumSelectedElements(state),
  hasPartToCopy: Boolean(getPartsToCopy(state)),
  enablePlay: Boolean(getChannelIds(state).length > 0 && allChannelsStopped(state)),
  enableStop: Boolean(getChannelIds(state).length && !allChannelsStopped(state)),
});

const mapDispatchToProps = dispatch => ({
  downloadConfigAction: () => dispatch(downloadConfig()),
  uploadConfigFileAction: (configFile) => dispatch(uploadConfigFile(configFile, audioContext)),
  uploadAudioFileAction: (audioFile) => dispatch(uploadAudioFile(audioFile, audioContext)),
  uploadConfigAction: (config) => dispatch(uploadConfig(config, audioContext)),
  createImageChannelAction: () => dispatch(createImageChannel()),
  exportImageChannelAction: (channelId) => dispatch(exportImageChannel(channelId)),
  deleteChannelAction: (channelId) => dispatch(deleteChannel(channelId)),
  playChannelAndImageAction: (channelId) => dispatch(playChannelAndImage(channelId)),
  stopChannelAction: () => dispatch(stopChannel()),
  setResolutionAction: (resolution) => dispatch(setResolution(resolution)),
  deleteSelectedPartAndMarkersAction: () => dispatch(deleteSelectedPartAndMarkers()),
  setChannelActiveAction: (channelId) => dispatch(setChannelActive(channelId)),
  unsetChannelActiveAction: (channelId) => dispatch(unsetChannelActive(channelId)),
  copyPartAction: () => dispatch(copyPart()),
  pastePartAction: () => dispatch(pastePart())
});

HeaderContainer.propTypes = {
  channelIds: PropTypes.array,
  downloadConfigAction: PropTypes.func.isRequired,
  uploadConfigFileAction: PropTypes.func.isRequired,
  uploadAudioFileAction: PropTypes.func.isRequired,
  deleteSelectedPartAndMarkersAction: PropTypes.func.isRequired,
  createImageChannelAction: PropTypes.func.isRequired,
  exportImageChannelAction: PropTypes.func.isRequired,
  deleteChannelAction: PropTypes.func.isRequired,
  playChannelAndImageAction: PropTypes.func.isRequired,
  stopChannelAction: PropTypes.func.isRequired,
  numSelectedElems: PropTypes.number,
  enablePlay: PropTypes.bool.isRequired,
  enableStop: PropTypes.bool.isRequired,
  setChannelActiveAction: PropTypes.func.isRequired,
  unsetChannelActiveAction: PropTypes.func.isRequired,
  setResolutionAction: PropTypes.func.isRequired,
  copyPartAction: PropTypes.func.isRequired,
  pastePartAction: PropTypes.func.isRequired,
  hasPartToCopy: PropTypes.bool,
};


export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
