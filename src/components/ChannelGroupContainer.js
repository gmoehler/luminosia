import React, { Component } from 'react';
import { connect } from 'react-redux';

import ChannelGroup from './ChannelGroup'
import { setChannelPlayState, moveChannel, addPartAndMarkers } from '../actions/channelActions'
import { select, setMarker, updateMarker } from '../actions/viewActions'
import { getallChannelsData, getMaxDuration, getLastPartId } from '../reducers/channelReducer'
import { getSelectionRange, getZoomLevel, getMode, getMarkers } from '../reducers/viewReducer'

class ChannelGroupContainer extends Component {

  getLastPartId = (channelId) => {
    getLastPartId(this.props.currentState, channelId)
  }

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
  addPartAndMarkers: (channelId, src, offset) => dispatch(addPartAndMarkers({
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
