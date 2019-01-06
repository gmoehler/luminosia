import React, { Component } from 'react';
import styled /*, { withTheme } */ from 'styled-components';

import ChannelControlContainer from './components/ChannelControlContainer';
import ImageListContainer from './components/ImageListContainer';
import ChannelGroupContainer from './components/ChannelGroupContainer';

import './App.css';


const Wrapper = styled.div`
  displayName: 'Wrapper'
  name: Wrapper
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
          <p>
            Animation authoring demo
          </p>
          <Wrapper>
            <ChannelControlContainer />
            <ImageListContainer />
            <ChannelGroupContainer />
          </Wrapper>
        </header>
      </div>
      );

  }
}
