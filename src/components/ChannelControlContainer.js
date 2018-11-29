import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadChannel, playChannel, stopChannel } from '../actions/channelActions'
import { setZoomLevel } from '../actions/viewActions'
import ChannelControl from './ChannelControl';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new window.AudioContext();

const zoomLevels = [100, 200, 500, 1000, 3000, 5000];
const defaultZommLevelIdx = 3;

class ChannelControlContainer extends Component {

  constructor(props) {
    super(props);
    this.zoomLevelIdx = defaultZommLevelIdx;
  }

  doLoadChannel = (event) => {
    this.resetZoom();
    this.props.loadChannelAction({
      channelSources: ["media/audio/BassDrums30.mp3", "media/audio/Vocals30.mp3", "media/image/mostlyStripes.png"],
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
    this.zoomLevelIdx = Math.min(Math.max(parseInt(this.zoomLevelIdx)-1, 0), zoomLevels.length-1);
    this.props.setZoomAction(
      zoomLevels[this.zoomLevelIdx]
    )
  }

  zoomOut = () => {
    this.zoomLevelIdx = Math.min(Math.max(parseInt(this.zoomLevelIdx)+1, 0), zoomLevels.length-1);
    this.props.setZoomAction(
      zoomLevels[this.zoomLevelIdx]
    )
  }

  render() {

    return (
      <ChannelControl loadChannel={ this.doLoadChannel } 
        playChannel={ this.props.playChannelAction } stopChannel={ this.props.stopChannelAction } 
        zoomIn={this.zoomIn} zoomOut={this.zoomOut}
        />
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
})


export default connect(mapStateToProps, mapDispatchToProps)(ChannelControlContainer);
