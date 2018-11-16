import React, { Component, Fragment } from 'react';

import AudioChannelContainer from './AudioChannelContainer'

// contains multiple AudioControlContainers
export default class AudioGroup extends Component {

  render() {

    return (
      <Fragment>
        <AudioChannelContainer/>
        <AudioChannelContainer/>
      </Fragment>);
  }
}

