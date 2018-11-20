import React, { Component } from 'react';
import { connect } from 'react-redux';

import AudioGroup from './AudioGroup'
import { getAllChannelData } from '../reducers/audioReducer'
import { getPlayState } from '../reducers/playReducer'

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
    playState: getPlayState(state)
  }
};

const mapDispatchToProps = dispatch => ({
  // no actions for now
})

export default connect(mapStateToProps, mapDispatchToProps)(AudioGroupContainer);
