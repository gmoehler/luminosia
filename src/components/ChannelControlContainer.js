import React, { Component } from 'react';
import { connect } from 'react-redux';
import { playChannel, stopChannel, deleteSelectedPartAndMarkers, addImageChannel, uploadAudioFile, deleteChannel } from '../actions/channelActions'

import { downloadConfig, uploadConfigFile, uploadConfig, exportImageChannel } from '../actions/generalActions'
import { setMode, select, setResolution } from '../actions/viewActions'
import { loadImagesfromStorage, saveImagesToStorage, clearImagesfromStorage, clearImageList } from '../actions/imageListActions'
import ChannelControl from './ChannelControl';
import { getChannelIds, hasAudioChannel, allChannelsStopped } from '../reducers/channelReducer';
import { getSelectedImage, getSelectedPart } from '../reducers/viewReducer';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new window.AudioContext();

const resolutions = [4000, 2000, 1000, 500, 250, 125, 80, 40, 20, 10, 5]; // in pixels / sec
const defaultResolutionIdx = 6;
const imageSampleRate = 100; // one image frame is 10ms

const channels = [
  {
    src: 'media/audio/Vocals30.mp3',
    name: 'Vocals',
    type: 'audio',
    offset: 2.0,
    cuein: 5.918,
    cueout: 14.5,
  },
  {
    src: 'media/audio/BassDrums30.mp3',
    name: 'Drums',
    type: 'audio',
    offset: 2.2,
    soloed: false,
  },
  {
    name: 'Channel 1 with images',
    type: 'image',
    sampleRate: imageSampleRate,
    parts: [{
      src: 'media/image/mostlyStripes.png',
      offset: 1.75,
      cuein: 0.5, // in secs
      cueout: 1.47, // in secs
    },
    {
      src: 'media/image/blueLine.png',
      offset: 3.75,
      cuein: 0.5, // in secs
      cueout: 1.47, // in secs
    }],
  },
]

const images = [
  {
    src: 'media/image/mostlyStripes.png',
    sampleRate: imageSampleRate,
  },
  {
    src: 'media/image/blueLine.png',
    sampleRate: imageSampleRate,
  },
];

const initConfig = {
  sampleRate: imageSampleRate, 
  images,
  channels,
} 

class ChannelControlContainer extends Component {

  constructor(props) {
    super(props);
    this.resolutionIdx = defaultResolutionIdx;
  }

  doInit = (event) => {
    this.resetZoom();
    this.props.uploadConfigAction(initConfig);
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
        loadImagesfromStorage={this.props.loadImagesfromStorageAction}
        saveImagesToStorage={this.props.saveImagestoStorageAction}
        clearImageList={this.props.clearImageListAction}
        clearImagesfromStorage={this.props.clearImagesfromStorageAction}
        uploadConfigFile={this.props.uploadConfigFileAction}
        uploadAudioFile={this.props.uploadAudioFileAction}
        deleteSelectedPart ={this.deleteSelectedPart}
        channelIds = { this.props.channelIds }
        addImageChannel={ this.props.addImageChannelAction } 
        exportImageChannel={ this.props.exportImageChannelAction }
        deleteChannel={ this.props.deleteChannelAction } 
        playChannel={ this.props.playChannelAction } 
        stopChannel={ this.props.stopChannelAction } 
        zoomIn={ this.zoomIn }
        zoomOut={ this.zoomOut } 
        setMode={ this.setMode } 
        selectedImageOrPart={this.props.selectedImageOrPart}
        enablePlay={this.props.enablePlay}  
        enableStop={this.props.enableStop}  
      />
      );
  }
}

const mapStateToProps = state => ({
   channelIds: getChannelIds(state),
   selectedImageOrPart: getSelectedImage(state) || getSelectedPart(state),
   enablePlay: hasAudioChannel(state) && allChannelsStopped(state),
   enableStop: hasAudioChannel(state) && !allChannelsStopped(state),
});

const mapDispatchToProps = dispatch => ({
  downloadConfigAction: () => dispatch(downloadConfig()),
  loadImagesfromStorageAction: () => dispatch(loadImagesfromStorage()),
  saveImagestoStorageAction: () => dispatch(saveImagesToStorage()),
  clearImagesfromStorageAction: () => dispatch(clearImagesfromStorage()),
  clearImageListAction: () => dispatch(clearImageList()),
  uploadConfigFileAction: (configFile) => dispatch(uploadConfigFile(configFile, audioContext)),
  uploadAudioFileAction: (audioFile) => dispatch(uploadAudioFile(audioFile, audioContext)),
  uploadConfigAction: (config) => dispatch(uploadConfig(config, audioContext)),
  addImageChannelAction: () => dispatch(addImageChannel()),
  exportImageChannelAction: (channelId) => dispatch(exportImageChannel(channelId)),
  deleteChannelAction: (channelId) => dispatch(deleteChannel(channelId)),
  playChannelAction: () => dispatch(playChannel()),
  stopChannelAction: () => dispatch(stopChannel()),
  setResolutionAction: (resolution) => dispatch(setResolution(resolution)),
  setModeAction: (modeEvent) => dispatch(setMode(modeEvent.target.value)),
  selectAction: (range) => dispatch(select(range)),
  deleteSelectedPartAndMarkers: () => dispatch(deleteSelectedPartAndMarkers()),
})


export default connect(mapStateToProps, mapDispatchToProps)(ChannelControlContainer);
