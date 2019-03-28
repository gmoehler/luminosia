import React, { Component } from "react";
import { connect } from "react-redux"; 

import ChannelGroup from "./ChannelGroup";
import { setChannelPlayState, insertNewPart, deleteSelectedPartAndMarkers, moveSelectedParts } from "../actions/channelActions";
import { selectRange, deselectRange, setMarker, updateMarker, toggleElementSelection, toggleElementMultiSelection, updateSelectedMarkers } from "../actions/viewActions";
import { getMaxDuration, getAllChannelsData, allChannelsStopped } from "../reducers/channelReducer";
import { getSelectionRange, getResolution, getMarkers, getSelectedImageChannelId } from "../reducers/viewReducer";
import { getImageSources } from "../reducers/imageListReducer";

class ChannelGroupContainer extends Component {

  render() {

    return (
      <ChannelGroup { ...this.props } />);
  }
}

const mapStateToProps = (state, props) => {
  // get audio data and play state from redux
  return {
    allChannelsData: getAllChannelsData(state),
    selection: getSelectionRange(state),
    resolution: getResolution(state),
    maxDuration: getMaxDuration(state),
    markers: getMarkers(state),
    imageSources: getImageSources(state),
    playState: allChannelsStopped(state) ? "stopped" : "playing",
    selectedImageChannelId: getSelectedImageChannelId(state),
  };
};

const mapDispatchToProps = dispatch => ({
  selectRange: (from, to) => dispatch(selectRange({
    from,
    to
  })),
  deselectRange: () => dispatch(deselectRange()),
  setMarker: (markerId, channelId, partId, pos, minPos, type) => dispatch(setMarker({
    markerId,
    channelId,
    partId,
    pos,
    minPos,
    type
  })),
  updateMarker: (markerId, channelId, partId, incr, type) => dispatch(updateMarker({
    markerId,
    channelId,
    partId,
    incr,
    type
  })),
  moveSelectedMarkers: (incr) => dispatch(updateSelectedMarkers({ 
    incr 
  })),
  insertNewPart: (channelId, imageId, src, offset, duration) => dispatch(insertNewPart({
    channelId,
    imageId,
    src,
    offset,
    duration,
  })),
  move: (channelId, partId, incr) => dispatch(moveSelectedParts({
    channelId,
    partId,
    incr
  })),
  toggleElementSelection: (partInfo) => dispatch(toggleElementSelection(partInfo)),
  toggleElementMultiSelection: (partInfo) => dispatch(toggleElementMultiSelection(partInfo)),
  deleteSelectedPartAndMarkers: () => dispatch(deleteSelectedPartAndMarkers()),
  setChannelPlayState: (channelId, playState) => dispatch(setChannelPlayState({
    channelId,
    playState
  })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelGroupContainer);
