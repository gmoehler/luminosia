import React, { Component } from 'react';
import { connect } from 'react-redux';

import AudioGroup from './AudioGroup'
import { setChannelPlayState } from '../actions/channelActions'
import { select } from '../actions/viewActions'
import { getAllChannelData } from '../reducers/channelReducer'
import { getSelectionRange } from '../reducers/viewReducer'

class AudioGroupContainer extends Component {

  render() {

    return (
      <AudioGroup {...this.props} />);
  }
}

const mapStateToProps = (state, props) => {
  // get audio data and play state from redux
  return {
    allAudioData: getAllChannelData(state),
    selection: getSelectionRange(state),
  }
};

const mapDispatchToProps = dispatch => ({
  select: (from, to) => dispatch(select({
    from,
    to
  })),
  setChannelPlayState: (channelId, playState) => dispatch(setChannelPlayState({
    channelId,
    playState
  })),
})

export default connect(mapStateToProps, mapDispatchToProps)(AudioGroupContainer);
