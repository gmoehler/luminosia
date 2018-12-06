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
      this.mouseDownX = 0; // x in px of mouse down event
      this.animationStartTime = null; // start time of progress animation
      this.playStartAt = 0; // start of current play
      this.playEndAt = 0; // end of current play
      this.state = {
        progress: 0, // play progress in secs
      };
      this.mousehandler = new MouseHandler(
        {
          select: this.select,
        },
      );

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new window.AudioContext();
    }

    componentDidUpdate(prevProps, prevState) {

      const {playState, selection, offset} = this.props;

      // start or stop playing
      if (prevProps.playState !== playState) {
        if (playState === "playing") {
          this.startPlay(selection.from, selection.to, offset);
        }
        // only stopped if not already (auto)stopped
        else if (this.isPlaying()) {
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
      if (this.props.type !== "audio") {
        return;
      }
      if (!this.playout) {
        this.playout = new Playout(this.audioContext, this.props.buffer);
      }

      // regular start at startAt
      if (!this.isPlaying() && endAt >= startAt) {

        // look at offset
        const actStartAt = Math.max(0, startAt); // dont start before 0
        const actEndAt = endAt - startAt < 0.1 ? this.props.buffer.duration + offset: endAt;
        const duration = actEndAt - actStartAt;

        const trackStartAt = actStartAt - offset < 0 ? 0 : actStartAt - offset;
        const trackDelay = startAt - offset < 0 ? offset - startAt : 0;
        const trackEndAt = actEndAt - offset;

        // remeber for progress offset
        this.playStartAt = actStartAt; 
        this.playStopAt = actEndAt;

        // only play if there is something to play
        if (trackEndAt > 0) {
          console.log(`playing from ${trackStartAt}s( ${actStartAt}s) to ${trackStartAt}(${actEndAt}s) with delay ${trackDelay}, offset: ${offset}`);
          this.playout.setUpSource()
            .then(this.stopPlay); // stop when end has reached
            
          this.playout.play(this.audioContext.currentTime + trackDelay, trackStartAt, duration);
        } else {
          console.log(`skip playing from ${actStartAt}s to ${actEndAt}`);
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
      const currentTimeInSecs = this.playStartAt + duration / 1000.0;

      this.setState({
        ...this.state,
        progress: currentTimeInSecs
      })
      
      if (currentTimeInSecs < this.playStopAt) {
        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      } else {
        this.stopPlay();
      }
    }

    stopAnimateProgress = () => {
      window.cancelAnimationFrame(this.animationRequest);
      this.animationStartTime = null;
    }

    isPlaying = () => {
      return this.animationStartTime !== null;
    }

    getSampleRate = () => {
      return this.props.sampleRate && this.props.buffer.sampleRate;
    }

    stopPlay = () => {
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

      const offset = secondsToPixels(this.props.offset, this.props.resolution, this.getSampleRate())
      const progressPx = secondsToPixels(this.state.progress, this.props.resolution, this.getSampleRate()) - offset;
      const cursorPx = secondsToPixels(selection.from, this.props.resolution, this.getSampleRate())  - offset;
      const selectionPx = {
        from: cursorPx,
        to: secondsToPixels(selection.to, this.props.resolution, this.getSampleRate()) - offset
      };
      //TODO: improve performance by memoization of peaks data
      const {data, length, bits} = this.doExtractPeaks(buffer, resolution, 16);
      const peaksDataMono = Array.isArray(data) ? data[0] : []; // only one channel for now

      return <WrappedComponent {...passthruProps} 
        handleMouseEvent={ this.mousehandler.handleMouseEvent } 
        offset={offset}
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