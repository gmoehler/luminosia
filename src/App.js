import React, { Component } from 'react';
import styled /*, { withTheme } */ from 'styled-components';

import ChannelControlContainer from './components/ChannelControlContainer';
import ChannelGroupContainer from './components/ChannelGroupContainer';

import logo from './logo.svg';
import './App.css';

const AudioWrapper = styled.div`
  displayName: 'AudioWrapper'
  name: AudioWrapper
  display: flex;
  flex-direction: column;
  justify-content: left;
  padding: 20px;
`;

export default class App extends Component {

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={ logo } className="App-logo" alt="logo" />
          <p>
            Waveform demo
          </p>
          <AudioWrapper>
            <ChannelControlContainer />
            <ChannelGroupContainer />
          </AudioWrapper>
        </header>
      </div>
      );

  }
}
