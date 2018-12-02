import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import extractPeaks from 'webaudio-peaks';
import memoize from 'memoize-one';

import Playout from '../player/Playout'
import MouseHandler from '../handler/SelectionMouseHandler'
import { secondsToPixels, pixelsToSeconds } from '../utils/conversions';

// HOC to support audio playing for one channel
export function withAudioPlay(WrappedComponent) {
  class WithAudioPlay extends PureComponent {

    constructor(props) {
      super(props);
      this.playout = null;
      this.startTime = 0; // start time of current play
      this.mouseDownX = 0; // x in px of mouse down event
      this.state = {
        progress: 0, // play progress in secs
      };
      this.mousehandler = new MouseHandler(
        {
          select: this.select,
        },
      );

      // member functions
      this.animateProgress = this.animateProgress.bind(this);
      this.stopAnimateProgress = this.stopAnimateProgress.bind(this);
      this.playChannel = this.playChannel.bind(this);
      this.stopChannel = this.stopChannel.bind(this);

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new window.AudioContext();
    }

    componentDidUpdate(prevProps, prevState) {

      const {playState, selection} = this.props;

      // start or stop playing
      if (prevProps.playState !== playState) {
        if (playState === "playing") {
          this.playChannel(selection.from, selection.to);
        }
        // only stopped if not already (auto)stopped
        else if (this.isPlaying()) {
          this.stopChannel();
        }
      }
    }

    componentWillUnmount() {
      // clean up playout and animation
      if (this.isPlaying()) {
        this.stopChannel();
      }
    }

    playChannel(startAt, endAt, delay = 0) {
      if (this.props.type !== "audio") {
        return;
      }
      if (!this.playout) {
        this.playout = new Playout(this.audioContext, this.props.buffer);
      }

      // regular start at startAt
      if (!this.isPlaying()) {
        const actStartAt = Math.max(0, startAt);
        console.log(`playing from ${actStartAt}s to ${endAt} with delay ${delay}`);
        this.playout.setUpSource()
          .then(this.stopChannel); // stop when end has reached
        const duration = endAt && Math.abs(endAt - actStartAt) > 0.1 ? endAt - actStartAt : 10;
        this.playout.play(delay, actStartAt, duration);

        // remember time when audio would have started at 0
        this.startTime = this.audioContext.currentTime - actStartAt;
        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      }
    }

    animateProgress() {
      this.setState({
        ...this.state,
        progress: this.audioContext.currentTime - this.startTime
      })
      this.animationRequest = window.requestAnimationFrame(this.animateProgress);
    }

    stopAnimateProgress() {
      window.cancelAnimationFrame(this.animationRequest);
    }

    isPlaying() {
      return this.playout && this.playout.isPlaying();
    }

    getSampleRate() {
      return this.props.sampleRate && this.props.buffer.sampleRate;
    }

    stopChannel() {
      this.playout && this.playout.stop();
      this.stopAnimateProgress();
      this.props.setChannelPlayState("stopped");
    }

    // transform from pixel to time values (used by mouse handler)
    select = (fromPx, toPx) => {
      const from = pixelsToSeconds(fromPx, this.props.resolution, this.props.sampleRate);
      const to = pixelsToSeconds(toPx, this.props.resolution, this.props.sampleRate);
      this.props.select(from, to);
    }

    // only recalc when buffer, resolution of bits change
    doExtractPeaks = memoize(
      (buffer, resolution, bits) => extractPeaks(buffer, resolution, true, 0, buffer.length, bits));

    render() {
      // select props passed down to Channel
      const {resolution, playState, buffer, selection, select, setChannelPlayState, ...passthruProps} = this.props;

      const progressPx = secondsToPixels(this.state.progress, this.props.resolution, this.getSampleRate());
      const cursorPx = secondsToPixels(selection.from, this.props.resolution, this.getSampleRate());
      const selectionPx = {
        from: cursorPx,
        to: secondsToPixels(selection.to, this.props.resolution, this.getSampleRate())
      };
      //TODO: improve performance by memoization of peaks data
      const {data, length, bits} = this.doExtractPeaks(buffer, resolution, 16);
      const peaksDataMono = Array.isArray(data) ? data[0] : []; // only one channel for now

      return <WrappedComponent {...passthruProps} 
        handleMouseEvent={ this.mousehandler.handleMouseEvent } 
        left={50}
        peaks={ peaksDataMono } bits={ bits } length={ length } progress={ progressPx } 
        cursorPos={ cursorPx } selection={ selectionPx }  
      />;
    }
  }
  ;

  WithAudioPlay.propTypes = {
    playState: PropTypes.oneOf(['stopped', 'playing']).isRequired,
    resolution: PropTypes.number.isRequired, // pixels per sample 
    buffer: PropTypes.object.isRequired,
    selection: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    setChannelPlayState: PropTypes.func.isRequired,
  }

  withAudioPlay.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithAudioPlay;
}


function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}