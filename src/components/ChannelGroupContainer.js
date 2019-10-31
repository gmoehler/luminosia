import React, { Component } from "react";
import { connect } from "react-redux";

import ChannelGroup from "./ChannelGroup";
import { setMessage } from "../actions/viewActions";
import { getSelectionRange, getResolution, isLoadingShow, getLoadProgressInPercent } from "../reducers/viewReducer";
import { getImageSources } from "../reducers/imageListReducer";
import { getAllMarkers } from "../reducers/markerReducer";
import { getMaxChannelDuration, getAllChannelIds, allChannelsStopped } from "../reducers/channelReducer";

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
  return {
    allchannelIds: getAllChannelIds(state),
    maxDuration: getMaxChannelDuration(state),
    imageSources: getImageSources(state),
    playState: allChannelsStopped(state) ? "stopped" : "playing", // for HOC withPlay only
    isLoadingShow: isLoadingShow(state),
    loadProgress: getLoadProgressInPercent(state),
    resolution: getResolution(state),

    markers: getAllMarkers(state),
    selection: getSelectionRange(state),
  };
};

const mapDispatchToProps = dispatch => ({
  setMessage: (text, type, title) => dispatch(setMessage({ text, type, title })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelGroupContainer);
