import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadAudio } from './actions/audioActions'
import { AudioGroupWithContext } from './components/AudioGroup';

import logo from './logo.svg';
import './App.css';

const scale = window.devicePixelRatio;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new window.AudioContext();

class App extends Component {

  doLoadAudio = (event) => {
    this.props.loadAudioAction({
      audioSource: "media/audio/Vocals30.mp3", 
      audioContext
    });
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
           Waveform demo
          </p>

          <AudioGroupWithContext 
            audioContext={audioContext}
            peaks={this.props.audio.peaks} 
            scale={scale} 
            doLoadAudio={this.doLoadAudio}  
            audioBuffer={this.props.audio.audioBuffer}
          />

        </header>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
 });

 const mapDispatchToProps = dispatch => ({
    loadAudioAction: spec => dispatch(loadAudio(spec))
 })

 
 export default connect(mapStateToProps, mapDispatchToProps)(App);
