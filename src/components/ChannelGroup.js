import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { CircularProgress } from "@material-ui/core";
import TimeScale from "./TimeScale";
import { timeToPixels } from "./timeToPixels";
import { secondsToPixels } from "../utils/conversions";
import ChannelContainer from "./ChannelContainer";
import { withEventHandler } from "./withEventHandler";

const ChannelGroupWrapper = styled.div`
  width:  calc(95vw - ${props => props.drawerWidth}px);
  transition: width .1s;
	overflow: auto;
	white-space: nowrap;
`;

const LoadProgressView = styled(CircularProgress)`
  margin: 20px;
  width: 100%;
`;

// add time conversion functionality time scale
const TimeScaleInSecs = withEventHandler(timeToPixels(TimeScale));

// contains multiple Channels
export default class ChannelGroup extends Component {
  constructor(props) {
    super(props);
    this.groupRef = null;
    this.state = {
      scrollLeft: 0,
    };
  }

  componentDidUpdate() {
    this.considerScroll();
  }

  considerScroll = () => {
    if (this.props.playState === "playing" && this.groupRef) {
      const scrolldiff = Math.abs(this.state.scrollLeft - this.groupRef.scrollLeft);
      if (scrolldiff > 10) { // do it only once for all channels
        this.groupRef.scrollLeft = this.state.scrollLeft;
      }
    }
  }

  reportProgress = (progress) => {
    // check progress to do autoscrolling 
    const progressPx = secondsToPixels(progress, this.props.resolution);
    if (progressPx > this.groupRef.scrollLeft + this.groupRef.clientWidth) {
      this.setState({ scrollLeft: progressPx });
    } else if (progressPx < this.groupRef.scrollLeft) {
      this.setState({ scrollLeft: progressPx });
    }
  }

  render() {

    const { allchannelIds, ...passthruProps } = this.props;

    const channelComponents = allchannelIds
      .map((channelId) => (

        <ChannelContainer { ...passthruProps }
          className="ChannelContainer"
          channelId={ channelId }
          key={ channelId }
          reportProgress={ this.reportProgress }
        />));

    return (
      <ChannelGroupWrapper
        className="ChannelGroupWrapper"
        drawerWidth={ this.props.drawerWidth || 0 }
        ref={ (ref) => this.groupRef = ref }>

        <TimeScaleInSecs
          className="TimeScaleInSecs"
          maxDuration={ this.props.maxDuration }
          resolution={ this.props.resolution }
          theme={ this.props.theme }
          setOrReplaceMarker={ this.props.setOrReplaceMarker }
          deleteMarker={ this.props.deleteMarker }
        />

        {channelComponents}

        {this.props.isLoadingShow &&
          <LoadProgressView disableShrink />
        }

      </ChannelGroupWrapper>
    );
  }
}

ChannelGroup.propTypes = {
  allchannelIds: PropTypes.array,
  resolution: PropTypes.number.isRequired,
  drawerWidth: PropTypes.number.isRequired,
  selectedImageChannelId: PropTypes.number,
  playState: PropTypes.string,
  maxDuration: PropTypes.number,
  isLoadingShow: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  setOrReplaceMarker: PropTypes.func.isRequired,
  deleteMarker: PropTypes.func.isRequired,
};