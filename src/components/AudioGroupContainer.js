import React, { Component } from 'react';
import { connect } from 'react-redux';

import AudioGroup from './AudioGroup'
import { getAllChannelData } from '../reducers/audioReducer'
import { getPlayState } from '../reducers/playReducer'

class AudioGroupContainer extends Component {

  render() {

    return (
      <AudioGroup
        audioData={ this.props.audioData }
        playState={ this.props.playState }
      />);
  }
}

const mapStateToProps = (state, props) => {
  // map complete redux state (all on audio key) for now
  const audioData = getAllChannelData(state);
  const playState = getPlayState(state);
  
  return {
    audioData,
    playState
  }
};

const mapDispatchToProps = dispatch => ({
  // no actions for now
})

export default connect(mapStateToProps, mapDispatchToProps)(AudioGroupContainer);
