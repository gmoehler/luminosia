import React, { Component } from 'react';
import { connect } from 'react-redux';

import ChannelGroup from './ChannelGroup'
import { setChannelPlayState, moveChannel, addPart } from '../actions/channelActions'
import { select, setMarker, updateMarker } from '../actions/viewActions'
import { getallChannelsData, getMaxDuration } from '../reducers/channelReducer'
import { getSelectionRange, getZoomLevel, getMode, getMarkers } from '../reducers/viewReducer'

class ChannelGroupContainer extends Component {

  render() {

    return (
      <ChannelGroup {...this.props} />);
  }
}

const mapStateToProps = (state, props) => {
  // get audio data and play state from redux
  return {
    allChannelsData: getallChannelsData(state),
    selection: getSelectionRange(state),
    pixelsPerSecond: getZoomLevel(state),
    maxDuration: getMaxDuration(state),
    mode: getMode(state),
    markers: getMarkers(state),
  }
};

const mapDispatchToProps = dispatch => ({
  select: (from, to) => dispatch(select({
    from,
    to
  })),
  setMarker: (markerId, pos) => dispatch(setMarker({
    markerId,
    pos
  })),
  updateMarker: (markerId, incr) => dispatch(updateMarker({
    markerId,
    incr
  })),
  addPart: (channelId, src, offset) => dispatch(addPart({
    channelId,
    src,
    offset
  })),
  move: (channelId, partId, incr) => dispatch(moveChannel({
    channelId, 
    partId,
    incr
  })),
  setChannelPlayState: (channelId, playState) => dispatch(setChannelPlayState({
    channelId,
    playState
  })),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChannelGroupContainer);
