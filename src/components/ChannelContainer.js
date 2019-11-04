import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import memoize from "memoize-one";
import extractPeaks from "webaudio-peaks";

import Channel from "./Channel";

import { getChannelData } from "../reducers/channelReducer";
import { getParts } from "../reducers/partReducer";
import { withEventHandler } from "./withEventHandler";
import { withPlay } from "./withPlay";
import { timeToPixels } from "./timeToPixels";
import { moveSelectedParts, resizePart, selectInInterval } from "../actions/partActions";
import { stopChannel, insertNewPart } from "../actions/channelActions";
import { toggleEntitySelection, toggleMultiEntitySelection, toggleInitialEntitySelection, deleteSelectedEntities } from "../actions/entityActions";
import { selectRange, deselectRange, selectImageChannel } from "../actions/viewActions";
import { setOrReplaceInsertMarker } from "../actions/markerActions";

// add play functionality to channels
const ChannelWithPlay = withEventHandler(withPlay(timeToPixels(Channel)));

class ChannelContainer extends Component {

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

  // only re-calc when buffer, resolution of bits change
  doExtractPeaks = memoize(
    (buffer, pixPerSample, bits) => extractPeaks(buffer, pixPerSample, true, 0, buffer.length, bits));


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

    const { channelId, buffer, sampleRate, resolution } = this.props;

    // memoized audio peak data
    const { data, duration, bits
    } = buffer ?
        this.doExtractPeaks(buffer, sampleRate / resolution, 16)
        : { data: [], length: 0, bits: 0 };
    const peaks = Array.isArray(data) ? data[0] : []; // only one channel for now

    const renderProps = {
      ...this.props,
      peaks,
      bits,
      duration,
    };

    return (
      <ChannelWithPlay { ...renderProps }
        resize={ (partId, markerId, incr) => this.props.resize(channelId, partId, markerId, incr) }
      />);
  }
}

const mapStateToProps = (state, props) => {
  const { channelId, images } = props;

  const channelData = getChannelData(state, channelId);
  const parts = getParts(state, channelData.parts);

  return {
    ...channelData,
    parts,
    images,
  };
};

const mapDispatchToProps = dispatch => ({
  selectRange: (from, to, type) => dispatch(selectRange({
    from,
    to,
    type
  })),
  deselectRange: () => dispatch(deselectRange()),
  selectInInterval: (channelId, from, to) => dispatch(selectInInterval(channelId, from, to)),
  setOrReplaceInsertMarker: (pos) => dispatch(setOrReplaceInsertMarker(pos)),
  insertNewPart: (channelId, imageId, offset) => dispatch(insertNewPart({
    channelId,
    imageId,
    offset
  })),
  deleteSelectedEntities: () => dispatch(deleteSelectedEntities()),
  move: (partId, incr) => dispatch(moveSelectedParts({
    partId,
    incr
  })),
  resize: (channelId, partId, markerId, incr) => dispatch(resizePart({
    channelId,
    partId,
    markerId,
    incr
  })),
  stopChannel: (channelId) => dispatch(stopChannel(channelId)),
  selectImageChannel: (channelId) => dispatch(selectImageChannel(channelId)),
  toggleEntitySelection: (partId) => dispatch(toggleEntitySelection(partId)),
  toggleMultiEntitySelection: (partId) => dispatch(toggleMultiEntitySelection(partId)),
  toggleInitialEntitySelection: (partId) => dispatch(toggleInitialEntitySelection(partId)),
});

ChannelContainer.propTypes = {
  channelId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  stopChannel: PropTypes.func.isRequired,
  move: PropTypes.func.isRequired,
  resize: PropTypes.func.isRequired,
  buffer: PropTypes.object,
  sampleRate: PropTypes.number.isRequired,
  resolution: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelContainer);
