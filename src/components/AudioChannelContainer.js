import React, { Component } from 'react';
import { connect } from 'react-redux';

import Channel from './Channel';
import { withAudioPlay } from './withAudioPlay'
import { getChannelData } from '../reducers/audioReducer'
import { getPlayState } from '../reducers/playReducer'

// add a player HOC
const AudioChannelWithPlay = withAudioPlay(Channel);

class AudioChannelContainer extends Component {

  render() {

    const {data, /* length, */ bits} = {
      ...this.props.audioData
    };

    const channelData = Array.isArray(data) ? data[0] : [];
    const scale = window.devicePixelRatio;

    return (
      <AudioChannelWithPlay 
        // for withAudioPlay
        audioData={ this.props.audioData }
        playState={this.props.playState}
        // for Channel
        peaks={ channelData } 
        length={ 500 } 
        bits={ bits } 
        scale={ scale }
      />);
  }
}

const mapStateToProps = (state, props) => {
  // map complete redux state (all on audio key) for now
  const audioData = getChannelData(state, props.channelSource);
  const playState = getPlayState(state);
  

  return {
    audioData,
    playState
  }
};

const mapDispatchToProps = dispatch => ({
  // no actions for now
})

export default connect(mapStateToProps, mapDispatchToProps)(AudioChannelContainer);
