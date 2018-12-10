import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadChannel, playChannel, stopChannel } from '../actions/channelActions'
import { setZoomLevel, setMode } from '../actions/viewActions'
import ChannelControl from './ChannelControl';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new window.AudioContext();

const zoomLevels = [6, 12, 24, 48, 96, 192, 384, 768, 1536, 3072, 6144]; // in pixels / sec
const defaultZommLevelIdx = 2;

const channelConfigs = [
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
    id: 'imgChannel1',
    name: 'Channel 1 with images',
    type: 'image',
    sampleRate: 100, // one image frame is 10ms
    images: [{
      src: 'media/image/mostlyStripes.png',
      offset: 1.75,
      cuein: 0.5, // in secs
      cueout: 1.47, // in secs
    }],  
  },
]

class ChannelControlContainer extends Component {

  constructor(props) {
    super(props);
    this.zoomLevelIdx = defaultZommLevelIdx;
  }

  doLoadChannel = (event) => {
    this.resetZoom();
    this.props.loadChannelAction({
      channelConfigs,
      audioContext,
    });
  }

  resetZoom = () => {
    this.zoomLevelIdx = defaultZommLevelIdx;
    this.props.setZoomAction(
      zoomLevels[this.zoomLevelIdx]
    )
  }

  zoomIn = () => {
    this.zoomLevelIdx = Math.min(Math.max(parseInt(this.zoomLevelIdx) + 1, 0), zoomLevels.length - 1);
    this.props.setZoomAction(
      zoomLevels[this.zoomLevelIdx]
    )
  }

  zoomOut = () => {
    this.zoomLevelIdx = Math.min(Math.max(parseInt(this.zoomLevelIdx) - 1, 0), zoomLevels.length - 1);
    this.props.setZoomAction(
      zoomLevels[this.zoomLevelIdx]
    )
  }

  render() {

    return (
      <ChannelControl loadChannel={ this.doLoadChannel } 
        playChannel={ this.props.playChannelAction } stopChannel={ this.props.stopChannelAction } 
        zoomIn={ this.zoomIn } zoomOut={ this.zoomOut }
        setMode={ this.props.setModeAction } />
      );
  }
}

const mapStateToProps = state => ({
  // no props for now
});

const mapDispatchToProps = dispatch => ({
  loadChannelAction: (spec) => dispatch(loadChannel(spec)),
  playChannelAction: () => dispatch(playChannel()),
  stopChannelAction: () => dispatch(stopChannel()),
  setZoomAction: (zoomLevel) => dispatch(setZoomLevel(zoomLevel)),
  setModeAction: (modeEvent) => dispatch(setMode(modeEvent.target.value)),
})


export default connect(mapStateToProps, mapDispatchToProps)(ChannelControlContainer);
