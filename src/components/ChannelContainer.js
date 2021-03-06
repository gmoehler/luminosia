import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import memoize from "memoize-one";
import extractPeaks from "webaudio-peaks";

import Channel from "./Channel";

import { getChannelData } from "../reducers/channelReducer";
import { getParts } from "../reducers/partReducer";
import { withPlay } from "./withPlay";
import { timeToPixels } from "./timeToPixels";
import { stopChannel, } from "../actions/channelActions";

// add play functionality to channels
const ChannelWithPlay = withPlay(timeToPixels(Channel));

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
          { this.state.error.message ?
            <p>
              {this.state.error.message}
            </p> : null}
          { this.state.error.stack ?
            <p>
              {this.state.error.stack}
            </p> : null}
        </div>
      );
    }

    const { buffer, sampleRate, resolution } = this.props;

    // memoized audio peak data
    const { data, duration, bits } = buffer ?
      this.doExtractPeaks(buffer, sampleRate / resolution, 16)
      : {
        data: [],
        length: 0,
        bits: 0
      };
    const peaks = Array.isArray(data) ? data[0] : []; // only one channel for now

    const renderProps = {
      ...this.props,
      peaks,
      bits,
      duration,
    };

    return (
      <ChannelWithPlay {...renderProps} />);
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
  stopChannel: (channelId) => dispatch(stopChannel(channelId)),
});

ChannelContainer.propTypes = {
  channelId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  stopChannel: PropTypes.func.isRequired,
  buffer: PropTypes.object,
  sampleRate: PropTypes.number.isRequired,
  resolution: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelContainer);
