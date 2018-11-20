import React, { Component } from 'react';
import { connect } from 'react-redux';

import AudioGroup from './AudioGroup'
import { playAudio } from '../actions/audioActions'
import { getAllChannelData } from '../reducers/audioReducer'
import { getPlayState, getPlayStartAt } from '../reducers/playReducer'

class AudioGroupContainer extends Component {

  render() {

    return (
      <AudioGroup
        {...this.props}
      />);
  }
}

const mapStateToProps = (state, props) => {
  // get audio data and play state from redux
  return {
    allAudioData: getAllChannelData(state),
    playState: getPlayState(state),
    startAt: getPlayStartAt(state)
  }
};

const mapDispatchToProps = dispatch => ({
  playAudio: (startAt) => dispatch(playAudio({startAt}))
})

export default connect(mapStateToProps, mapDispatchToProps)(AudioGroupContainer);
