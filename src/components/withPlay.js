/*
  HOC to support audio/image playing for one channel
  also updates play progress in channel
  and generates the waveform based on the audio data
*/

import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Playout from "../player/Playout";

export function withPlay(WrappedComponent) {

  class WithPlay extends PureComponent {

    constructor(props) {
      super(props);
      this.animationStartTime = null; // start time of progress animation timer, null means not playing
      this.playStartAt = 0; // start of current play
      this.playEndAt = 0; // end of current play
      this.state = {
        progress: null, // play progress in secs
      };
    }

    componentDidMount() {
      // audio setup
      if (this.props.type === "audio") {
        this.playout = null;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new window.AudioContext();
      }
    }

    componentDidUpdate(prevProps, prevState) {

      const {playState, selection, offset} = this.props;

      // start or stop playing
      if (prevProps.playState !== playState) {
        if (playState === "playing") {
          this.startPlay(selection.from, selection.to, offset
          );
        } else if (this.isPlaying()) {
          // only stopped if not already (auto)stopped
          this.stopPlay();
        }
      }
    }

    componentWillUnmount() {
      // clean up playout and animation
      if (this.isPlaying()) {
        this.stopPlay();
      }
    }

    startPlay = (startAt, endAt, offset) => {
      if (!this.playout && this.audioContext) {
        this.playout = new Playout(this.audioContext, this.props.buffer);
      }

      // regular start at startAt
      if (!this.isPlaying() && endAt >= startAt) {

        // act.. values is global time interval of this channel
        const actOffset = offset
          ? offset
          : 0;
        const actStartAt = Math.max(0, startAt); // dont start before 0
        const duration = this.props.buffer
          ? this.props.buffer.duration
          : this.props.maxDuration;
        const actEndAt = endAt - startAt < 0.1
          ? duration + actOffset
          : endAt;

        // track.. values are local image time
        const trackStartAt = actStartAt - actOffset < 0
          ? 0
          : actStartAt - actOffset;
        const trackDelay = startAt - actOffset < 0
          ? actOffset - startAt
          : 0;
        const trackEndAt = actEndAt - actOffset;

        // remember for progress offset
        this.animateStartAt = actStartAt;
        this.animateEndAt = endAt - startAt < 0.1
          ? this.props.maxDuration + actOffset
          : trackEndAt + actOffset;

        // only play if there is something to play and only for audio (for now)
        if (trackEndAt > 0 && this.playout) {
          console.log(`playing ${this.props.type} from ${trackStartAt}s( ${actStartAt}s) ` +
            `to ${trackEndAt}(${actEndAt}s) with delay ${trackDelay}, offset: ${actOffset}, ` +
            `delay ${trackDelay}`);

          this
            .playout
            .setUpSource()
            .then(this.stopPlay); // stop when end has reached

          const duration = actEndAt - actStartAt;
          this
            .playout
            .play(this.audioContext.currentTime + trackDelay, trackStartAt, duration);
        } else {
          // console.log(`skip  ${this.props.type} playing from ${actStartAt}s to
          // ${actEndAt}`);
        }

        // start progress animation
        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      }
    }

    animateProgress = (timestamp) => {

      if (!this.animationStartTime) {
        this.animationStartTime = timestamp;
      //TODO: sync with playout time
      }

      const duration = timestamp - this.animationStartTime;
      const currentTimeInSecs = this.animateStartAt + duration / 1000.0;

      this.setState({
        ...this.state,
        progress: currentTimeInSecs
      });

      if (this.props.reportProgress) {
        this
          .props
          .reportProgress(currentTimeInSecs);
      }

      if (currentTimeInSecs < this.animateEndAt) {
        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      } else {
        this.stopPlay();
      }
    }

    stopAnimateProgress = () => {
      window.cancelAnimationFrame(this.animationRequest);
      this.setState({
        ...this.state,
        progress: null
      });
      this.animationStartTime = null;
    }

    isPlaying = () => {
      return this.animationStartTime !== null;
    }

    stopPlay = () => {
      this.playout && this
        .playout
        .stop();
      this.stopAnimateProgress();
      this
        .props
        .stopChannel(this.props.channelId);
    }

    render() {

      // time to pixel conversion is done in HOC TimeToPixel
      return (<WrappedComponent {... this.props} progress={ this.state.progress } />);
    }
  }
  ;

  WithPlay.propTypes = {
    channelId: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["audio", "image", "animation"]),
    offset: PropTypes.number,
    buffer: PropTypes.object,
    sampleRate: PropTypes.number.isRequired,
    resolution: PropTypes.number.isRequired,
    playState: PropTypes
      .oneOf(["stopped", "playing"])
      .isRequired,
    reportProgress: PropTypes.func,
    selection: PropTypes.exact({
      from: PropTypes.number,
      to: PropTypes.number,
      type: PropTypes.string
    }),
    stopChannel: PropTypes.func.isRequired,
    maxDuration: PropTypes.number
  };

  withPlay.displayName = `WithPlay(${getDisplayName(WrappedComponent)})`;
  return WithPlay;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}