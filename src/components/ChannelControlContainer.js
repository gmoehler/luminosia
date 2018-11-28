import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadChannel, playChannel, stopChannel } from '../actions/channelActions'
import ChannelControl from './ChannelControl';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new window.AudioContext();

class ChannelControlContainer extends Component {

  doLoadChannel = (event) => {
    this.props.loadChannelAction({
      channelSources: ["media/audio/BassDrums30.mp3", "media/audio/Vocals30.mp3", "media/image/mostlyStripes.png"],
      audioContext
    });
  }

  render() {

    return (
      <ChannelControl loadChannel={ this.doLoadChannel } playChannel={ this.props.playChannelAction } stopChannel={ this.props.stopChannelAction } />
      );
  }
}

const mapStateToProps = state => ({
  // no props for now
});

const mapDispatchToProps = dispatch => ({
  loadChannelAction: (spec) => dispatch(loadChannel(spec)),
  playChannelAction: () => dispatch(playChannel()),
  stopChannelAction: () => dispatch(stopChannel())
})


export default connect(mapStateToProps, mapDispatchToProps)(ChannelControlContainer);
