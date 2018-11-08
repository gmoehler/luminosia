import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadAudio } from './actions/loadAudioActions'
import { simpleAction } from './actions/simpleActions'

import Channel from './components/Channel';
import BBCWaveformData from './vocals.json';

import logo from './logo.svg';
import './App.css';


const {
  sample_rate: sampleRate,
  samples_per_pixel: samplesPerPixel,
  bits,
  length,
  data
} = BBCWaveformData;

const scale = window.devicePixelRatio;

window.OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new window.AudioContext();

class App extends Component {

  simpleAction = (event) => {
    this.props.simpleAction();
  }

  loadAudioAction = (event) => {
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
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={this.simpleAction}>Test redux action</button>
          <button onClick={this.loadAudioAction}>Test redux action</button>
          <Channel data={data} length={length} bits={bits} scale={scale}></Channel>
          <p>{JSON.stringify(this.props)}</p>

        </header>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
 });

 const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction()),
  loadAudioAction: spec => dispatch(loadAudio(spec))
 })


 export default connect(mapStateToProps, mapDispatchToProps)(App);
