import React, { Component } from 'react';
import styled /*, { withTheme } */ from 'styled-components';

import ChannelControlContainer from './components/ChannelControlContainer';
import ImageListContainer from './components/ImageListContainer';
import ChannelGroupContainer from './components/ChannelGroupContainer';

import './App.css';
import ImageExporter from './components/ImageExporter';


const Wrapper = styled.div`
  displayName: 'Wrapper'
  name: Wrapper
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
`;

export default class App extends Component {

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <p>
            Animation authoring tool
          </p>
          <Wrapper>
            <ChannelControlContainer />
            <ImageListContainer />
            <ImageExporter/>
            <ChannelGroupContainer />
          </Wrapper>
        </header>
      </div>
      );

  }
}
