import React, { Component } from 'react';
import { connect } from 'react-redux';

import Channel from './Channel';
import { withAudioPlay } from './withAudioPlay'

// add a player HOC
const AudioChannelWithPlay = withAudioPlay(Channel);

class AudioChannelContainer extends Component {

  render() {

    const {data, /* length, */ bits} = {
      ...this.props.audio.peaks
    };

    const channelData = Array.isArray(data) ? data[0] : [];

    const scale = window.devicePixelRatio;

    return (
      <AudioChannelWithPlay 
        // for withAudioPlay
        audioData={ this.props.audio }
        // for Channel
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
