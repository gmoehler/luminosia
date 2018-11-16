import React, { Component } from 'react';
import AudioContentProvider from './components/AudioContentProvider';

import logo from './logo.svg';
import './App.css';


export default class App extends Component {

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={ logo } className="App-logo" alt="logo" />
          <p>
            Waveform demo
          </p>
          <AudioContentProvider />
        </header>
      </div>
      );
  }
}
