import React, { Component, Fragment } from 'react';

import AudioChannelContainer from './AudioChannelContainer'

// contains multiple AudioControlContainers
export default class AudioGroup extends Component {

  render() {

    return (
      <Fragment>
        <AudioChannelContainer channelSource="media/audio/BassDrums30.mp3"/>
      </Fragment>);
  }
}

