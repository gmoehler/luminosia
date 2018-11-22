import React, { Component } from 'react';
import { connect } from 'react-redux';

import AudioGroup from './AudioGroup'
import { select, setChannelPlayState } from '../actions/audioActions'
import { getAllChannelData } from '../reducers/audioReducer'
import { getPlayState, getChannelPlayStates } from '../reducers/playReducer'
import { getSelectionRange } from '../reducers/selectionReducer'

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
    selection: getSelectionRange(state),
    channelPlayStates: getChannelPlayStates(state),
  }
};

const mapDispatchToProps = dispatch => ({
  select: (from, to) => dispatch(select({from, to})),
  setChannelPlayState: (channelId, playState) => 
    dispatch(setChannelPlayState({channelId, playState})),
})

export default connect(mapStateToProps, mapDispatchToProps)(AudioGroupContainer);
