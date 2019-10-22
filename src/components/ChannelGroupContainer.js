import React, { Component } from "react";
import { connect } from "react-redux";

import ChannelGroup from "./ChannelGroup";
import { setMessage } from "../actions/viewActions";
import { getSelectionRange, getResolution, getUploadLog, isUploadingConfig } from "../reducers/viewReducer";
import { getImageSources } from "../reducers/imageListReducer";
import { getAllMarkers } from "../reducers/markerReducer";
import { getMaxChannelDuration, getAllChannelIds, allChannelsStopped } from "../reducers/achannelReducer";

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
    selection: getSelectionRange(state),
    resolution: getResolution(state),
    maxDuration: getMaxChannelDuration(state),
    markers: getAllMarkers(state),
    imageSources: getImageSources(state),
    playState: allChannelsStopped(state) ? "stopped" : "playing",
    uploadLog: getUploadLog(state),
    isUploadingConfig: isUploadingConfig(state),
  };
};

const mapDispatchToProps = dispatch => ({
  setMessage: (text, type, title) => dispatch(setMessage({ text, type, title })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelGroupContainer);
