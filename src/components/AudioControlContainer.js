import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadAudio, playChannel, stopChannel } from '../actions/channelActions'
import AudioControl from './AudioControl';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new window.AudioContext();

class AudioControlContainer extends Component {

  doLoadAudio = (event) => {
    this.props.loadAudioAction({
      audioSources: ["media/audio/BassDrums30.mp3", "media/audio/Vocals30.mp3", "media/image/mostlyStripes.png"],
      audioContext
    });
  }

  render() {

    return (
      <AudioControl loadAudio={ this.doLoadAudio } playChannel={ this.props.playChannelAction } stopChannel={ this.props.stopChannelAction } />
      );
  }
}

const mapStateToProps = state => ({
  // no props for now
});

const mapDispatchToProps = dispatch => ({
  loadAudioAction: (spec) => dispatch(loadAudio(spec)),
  playChannelAction: () => dispatch(playChannel()),
  stopChannelAction: () => dispatch(stopChannel())
})


export default connect(mapStateToProps, mapDispatchToProps)(AudioControlContainer);
