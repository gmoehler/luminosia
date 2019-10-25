import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ImageChannel from "./ImageChannel";
import Channel from "./Channel";

import { getChannelData } from "../reducers/achannelReducer";
import { getParts } from "../reducers/partReducer";
import { withEventHandler } from "./withEventHandler";
import { withPlay } from "./withPlay";
import { timeToPixels } from "./timeToPixels";
import { moveSelectedParts, resizeAPart, selectInInterval } from "../actions/partActions";
import { stopAChannel, insertNewPart } from "../actions/channelActions";
import { toggleEntitySelection, toggleMultiEntitySelection, toggleInitialEntitySelection, deleteSelectedEntities } from "../actions/entityActions";
import { selectRange, deselectRange } from "../actions/viewActions";
import { setOrReplaceInsertMarker } from "../actions/markerActions";


// add play functionality to audio channels
const ChannelWithPlay = withEventHandler(withPlay(timeToPixels(Channel)));
const ImageChannelWithPlay = withEventHandler(withPlay(timeToPixels(ImageChannel)));

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

    const { type, loading, channelId } = this.props;

    if (loading) {
      return null;
    }

    return (
      type === "audio"
        ? <ChannelWithPlay { ...this.props } />
        : <ImageChannelWithPlay { ...this.props }
          resize={ (partId, markerId, incr) =>
            this.props.resize(channelId, partId, markerId, incr) }
        />);
  }
}

const mapStateToProps = (state, props) => {
  const { channelId, selection, markers, imageSources } = props;

  const channelData = getChannelData(state, channelId);
  const parts = getParts(state, channelData.parts);

  return {
    ...channelData,
    parts,
    selection,
    markers,
    imageSources,
  };
};

const mapDispatchToProps = dispatch => ({
  selectRange: (from, to, type) => dispatch(selectRange({ from, to, type })),
  deselectRange: () => dispatch(deselectRange()),
  selectInInterval: (channelId, from, to) => dispatch(selectInInterval(channelId, from, to)),
  setOrReplaceInsertMarker: (pos) => dispatch(setOrReplaceInsertMarker(pos)),
  insertNewPart: (channelId, imageId, offset) => dispatch(insertNewPart({ channelId, imageId, offset })),
  deleteSelectedEntities: () => dispatch(deleteSelectedEntities()),
  move: (partId, incr) => dispatch(moveSelectedParts({ partId, incr })),
  resize: (channelId, partId, markerId, incr) => dispatch(resizeAPart({ channelId, partId, markerId, incr })),
  stopChannel: (channelId) => dispatch(stopAChannel(channelId)),
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
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelContainer);
