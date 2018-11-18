import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadAudio, playAudio, stopAudio } from '../actions/audioActions'
import AudioControl from './AudioControl';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new window.AudioContext();

class AudioControlContainer extends Component {

  doLoadAudio = (event) => {
    this.props.loadAudioAction({
      audioSources: ["media/audio/BassDrums30.mp3"],
      audioSource: "media/audio/Vocals30.mp3",
      audioContext
    });
  }

  render() {

    return (
      <AudioControl
        loadAudio={ this.doLoadAudio } 
        playAudio={ this.props.playAudioAction }
        stopAudio={ this.props.stopAudioAction } />
      );
  }
}

const mapStateToProps = state => ({
  // no props for now
});

const mapDispatchToProps = dispatch => ({
  loadAudioAction: spec => dispatch(loadAudio(spec)),
  playAudioAction: () => dispatch(playAudio()),
  stopAudioAction: () => dispatch(stopAudio())
})


export default connect(mapStateToProps, mapDispatchToProps)(AudioControlContainer);
