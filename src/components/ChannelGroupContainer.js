import React, { Component } from "react";
import { connect } from "react-redux";

import ChannelGroup from "./ChannelGroup";
import { setMessage } from "../actions/viewActions";
import { getSelectionRange, getResolution, isLoadingShow } from "../reducers/viewReducer";
import { getImages } from "../reducers/imageListReducer";
import { getMaxChannelDuration, getAllChannelIds, allChannelsStopped } from "../reducers/channelReducer";
import { defaultTheme } from "./themes";
import { setOrReplaceMarker } from "../actions/markerActions";

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


    const renderProps = {
      ...this.props,
      theme: defaultTheme
    };

    return (
      <ChannelGroup { ...renderProps } />
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    allchannelIds: getAllChannelIds(state),
    maxDuration: getMaxChannelDuration(state),
    images: getImages(state),
    playState: allChannelsStopped(state) ? "stopped" : "playing", // for HOC withPlay only
    isLoadingShow: isLoadingShow(state),
    resolution: getResolution(state),

    selection: getSelectionRange(state),
  };
};

const mapDispatchToProps = dispatch => ({
  setMessage: (text, type, title) => dispatch(setMessage({ text, type, title })),
  setOrReplaceMarker: (markerInfo) => dispatch(setOrReplaceMarker(markerInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelGroupContainer);
