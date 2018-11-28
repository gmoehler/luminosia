import React, { Component } from 'react';
import { connect } from 'react-redux';

import ChannelGroup from './ChannelGroup'
import { setChannelPlayState } from '../actions/channelActions'
import { select } from '../actions/viewActions'
import { getAllChannelData } from '../reducers/channelReducer'
import { getSelectionRange } from '../reducers/viewReducer'

class ChannelGroupContainer extends Component {

  render() {

    return (
      <ChannelGroup {...this.props} />);
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

export default connect(mapStateToProps, mapDispatchToProps)(ChannelGroupContainer);
