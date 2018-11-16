import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadAudio, playAudio, stopAudio } from '../actions/audioActions'
import AudioContent from '././AudioContent';

const scale = window.devicePixelRatio;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new window.AudioContext();

class AudioContentProvider extends Component {

  doLoadAudio = (event) => {
    this.props.loadAudioAction({
      audioSource: "media/audio/Vocals30.mp3",
      audioContext
    });
  }

  render() {

    return (
      <AudioContent 
        audioContext={ audioContext } 
        audio={ this.props.audio } 
        scale={ scale } 
        loadAudio={ this.doLoadAudio } 
        playAudio={ this.props.playAudioAction }
        stopAudio={ this.props.stopAudioAction } />
      );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  loadAudioAction: spec => dispatch(loadAudio(spec)),
  playAudioAction: () => dispatch(playAudio()),
  stopAudioAction: () => dispatch(stopAudio())
})


export default connect(mapStateToProps, mapDispatchToProps)(AudioContentProvider);
