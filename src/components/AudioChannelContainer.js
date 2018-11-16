import React, { Component } from 'react';
import { connect } from 'react-redux';

import Channel from './Channel';
import { withPlayContext } from './withPlayContext'

// add a player HOC
const ChannelWithPlay = withPlayContext(Channel);

class AudioChannelContainer extends Component {

  render() {

    const {data, /* length, */ bits} = {
      ...this.props.audio.peaks
    };

    const channelData = Array.isArray(data) ? data[0] : [];

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new window.AudioContext();
    const scale = window.devicePixelRatio;

    return (
      <ChannelWithPlay 
        audioContext={ audioContext } 
        audio={ this.props.audio }
        peaks={ channelData } 
        length={ 500 } 
        bits={ bits } 
        scale={ scale }
      />);
  }
}

const mapStateToProps = state => ({
  // map complete redux state (all on audio key) for now
  ...state
});

const mapDispatchToProps = dispatch => ({
  // no actions for now
})

export default connect(mapStateToProps, mapDispatchToProps)(AudioChannelContainer);
