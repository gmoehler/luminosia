import React, { Component } from 'react';
import { connect } from 'react-redux';
import { stopChannel, deleteSelectedPartAndMarkers, addImageChannel, uploadAudioFile, deleteChannel, playChannelAndImage, selectChannel, deselectChannel } from '../actions/channelActions'

import { downloadConfig, uploadConfigFile, uploadConfig, exportImageChannel } from '../actions/generalActions'
import { setMode, select, setResolution } from '../actions/viewActions'
import ChannelControl from './ChannelControl';
import { getChannelIds, allChannelsStopped } from '../reducers/channelReducer';
import { getSelectedImage, getSelectedPart } from '../reducers/viewReducer';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = window.AudioContext && new window.AudioContext();

const resolutions = [4000, 2000, 1000, 500, 250, 125, 80, 40, 20, 10, 5]; // in pixels / sec
const defaultResolutionIdx = 6;

class ChannelControlContainer extends Component {

  constructor(props) {
    super(props);
    this.resolutionIdx = defaultResolutionIdx;
  }
  
  deleteSelectedPart = () => {
    this.props.deleteSelectedPartAndMarkers();
  }

  resetZoom = () => {
    this.resolutionIdx = defaultResolutionIdx;
    this.props.setResolutionAction(
      resolutions[this.resolutionIdx]
    )
  }

  zoomIn = () => {
    this.resolutionIdx = Math.min(Math.max(parseInt(this.resolutionIdx) - 1, 0), resolutions.length - 1);
    this.props.setResolutionAction(
      resolutions[this.resolutionIdx]
    )
  }

  zoomOut = () => {
    this.resolutionIdx = Math.min(Math.max(parseInt(this.resolutionIdx) + 1, 0), resolutions.length - 1);
    this.props.setResolutionAction(
      resolutions[this.resolutionIdx]
    )
  }

  setMode = (mode) => {
    this.props.selectAction({
      from: null,
      to: null
    });
    this.props.setModeAction(mode);
  }

  render() {

    return (
      <ChannelControl 
        init={ this.doInit } 
        downloadConfig={this.props.downloadConfigAction}
        uploadConfigFile={this.props.uploadConfigFileAction}
        uploadAudioFile={this.props.uploadAudioFileAction}
        deleteSelectedPart ={this.deleteSelectedPart}
        channelIds = { this.props.channelIds }
        addImageChannel={ this.props.addImageChannelAction } 
        exportImageChannel={ this.props.exportImageChannelAction }
        deleteChannel={ this.props.deleteChannelAction } 
        playChannelAndImage={ this.props.playChannelAndImageAction } 
        stopChannel={ this.props.stopChannelAction } 
        zoomIn={ this.zoomIn }
        zoomOut={ this.zoomOut } 
        setMode={ this.setMode } 
        selectedImageOrPart={this.props.selectedImageOrPart}
        enablePlay={this.props.enablePlay}  
        enableStop={this.props.enableStop} 
        selectChannel={this.props.selectChannelAction}
        deselectChannel={this.props.deselectChannelAction}
      />
      );
  }
}

const mapStateToProps = state => ({
   channelIds: getChannelIds(state),
   selectedImageOrPart: getSelectedImage(state) || getSelectedPart(state),
   enablePlay: getChannelIds(state).length > 0 && allChannelsStopped(state),
   enableStop: getChannelIds(state).length && !allChannelsStopped(state),
});

const mapDispatchToProps = dispatch => ({
  downloadConfigAction: () => dispatch(downloadConfig()),
  uploadConfigFileAction: (configFile) => dispatch(uploadConfigFile(configFile, audioContext)),
  uploadAudioFileAction: (audioFile) => dispatch(uploadAudioFile(audioFile, audioContext)),
  uploadConfigAction: (config) => dispatch(uploadConfig(config, audioContext)),
  addImageChannelAction: () => dispatch(addImageChannel()),
  exportImageChannelAction: (channelId) => dispatch(exportImageChannel(channelId)),
  deleteChannelAction: (channelId) => dispatch(deleteChannel(channelId)),
  playChannelAndImageAction: (channelId) => dispatch(playChannelAndImage(channelId)),
  stopChannelAction: () => dispatch(stopChannel()),
  setResolutionAction: (resolution) => dispatch(setResolution(resolution)),
  setModeAction: (modeEvent) => dispatch(setMode(modeEvent.target.value)),
  selectAction: (range) => dispatch(select(range)),
  deleteSelectedPartAndMarkers: () => dispatch(deleteSelectedPartAndMarkers()),
  selectChannelAction: (channelId) => dispatch(selectChannel(channelId)),
  deselectChannelAction: (channelId) => dispatch(deselectChannel(channelId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(ChannelControlContainer);
