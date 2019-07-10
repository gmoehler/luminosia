import React, { Component } from "react";
import { connect } from "react-redux";

import ChannelGroup from "./ChannelGroup";
import { setChannelPlayState, insertNewPart, deleteSelectedPartAndMarkers, moveSelectedPartsWithMarkers, resizePartWithMarkers } from "../actions/channelActions";
import { selectRange, deselectRange, setMarker, toggleElementSelection, toggleElementMultiSelection, setMessage, selectInInterval } from "../actions/viewActions";
import { getMaxDuration, getAllChannelsData, allChannelsStopped } from "../reducers/channelReducer";
import { getSelectionRange, getResolution, getMarkers, getSelectedImageChannelId, getUploadLog, isUploadingConfig } from "../reducers/viewReducer";
import { getImageSources } from "../reducers/imageListReducer";

class ChannelGroupContainer extends Component {

  static getDerivedStateFromError(error) {
    return {
      error
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  componentDidCatch(error, state) {
    this.setState({
      error
    });
  }

  render() {

    if (this.state.error) {
      return (
        <div>
          <p> ERROR! Cannot continue. </p>
          {this.state.error.message ? <p>
            {this.state.error.message} </p> : null}
          {this.state.error.stack ? <p>
            {this.state.error.stack} </p> : null}
        </div>
      );
    }

    return (
      <ChannelGroup { ...this.props } />
    );
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
    uploadLog: getUploadLog(state),
    isUploadingConfig: isUploadingConfig(state),
  };
};

const mapDispatchToProps = dispatch => ({
  selectRange: (from, to, type) => dispatch(selectRange({
    from,
    to,
    type
  })),
  deselectRange: () => dispatch(deselectRange()),
  selectInInterval: (from, to) => dispatch(selectInInterval(from, to)),
  setMarker: (markerId, channelId, partId, pos, minPos, type) => dispatch(setMarker({
    markerId,
    channelId,
    partId,
    pos,
    minPos,
    type
  })),
  insertNewPart: (channelId, imageId, offset) => dispatch(insertNewPart({
    channelId,
    imageId,
    offset,
  })),
  move: (channelId, partId, incr) => dispatch(moveSelectedPartsWithMarkers({
    channelId,
    partId,
    incr
  })),
  resize: (channelId, partId, markerId, incr) => dispatch(resizePartWithMarkers({
    channelId,
    partId,
    markerId,
    incr
  })),
  toggleElementSelection: (partInfo) => dispatch(toggleElementSelection(partInfo)),
  toggleElementMultiSelection: (partInfo) => dispatch(toggleElementMultiSelection(partInfo)),
  deleteSelectedPartAndMarkers: () => dispatch(deleteSelectedPartAndMarkers()),
  setChannelPlayState: (channelId, playState) => dispatch(setChannelPlayState({
    channelId,
    playState
  })),
  setMessage: (text, type, title) => dispatch(setMessage({
    text,
    type,
    title
  })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelGroupContainer);
