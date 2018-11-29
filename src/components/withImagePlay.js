import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { secondsToPixels, pixelsToSeconds } from '../utils/conversions';

// HOC to support image playing for one channel
export function withImagePlay(WrappedComponent) {
  class WithImagePlay extends PureComponent {

    constructor(props) {
      super(props);
      this.playState = "running";
      this.startTime = 0; // start time of current play
      this.endTime = 0; // end time of current play
      this.animationStartTime = null; // start time of internal animation timer, null means not playing
      this.mouseDownX = 0; // x in px of mouse down event
      this.state = {
        progress: 0, // play progress in secs
      };
      // class functions
      this.animateProgress = this.animateProgress.bind(this);
      this.stopAnimateProgress = this.stopAnimateProgress.bind(this);
      this.startPlay = this.startPlay.bind(this);
      this.stopPlay = this.stopPlay.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {

      const {playState, selection} = this.props;

      // start or stop playing
      if (prevProps.playState !== playState) {
        if (playState === "playing") {
          this.startPlay(selection.from, selection.to);
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

    startPlay(startAt, endAt) {
      if (this.props.type !== "image") {
        return;
      }

      // regular start at startAt
      if (!this.isPlaying()) {
        this.startTime = Math.max(0, startAt);
        const duration = endAt && Math.abs(endAt - this.startTime) > 0.1 ? endAt - this.startTime : 10;
        this.endTime = this.startTime + duration;
        console.log(`playing image from ${this.startTime}s to ${this.endTime}`);

        // nothing to be done for playing right now

        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      }
    }

    animateProgress(timestamp) {
      if (!this.animationStartTime) {
        this.animationStartTime = timestamp;
      }
      const duration = timestamp - this.animationStartTime;
      const currentTimeInSecs = this.startTime + duration / 1000.0;
      this.setState({
        ...this.state,
        progress: currentTimeInSecs
      });
      if (currentTimeInSecs < this.endTime) {
        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      } else {
        this.stopPlay();
      }
    }

    stopAnimateProgress() {
      window.cancelAnimationFrame(this.animationRequest);
    }

    isPlaying() {
      return this.animationStartTime !== null;
    }

    stopPlay() {
      this.stopAnimateProgress();
      this.animationStartTime = null;
      this.props.setChannelPlayState("stopped");
    }

    // start selection
    handleMouseDown = (e) => {
      e.preventDefault();
      var bounds = e.target.getBoundingClientRect();
      this.mouseDownX = e.clientX - bounds.left;
      // console.log('mouse down at: ', this.mouseDownX);
      const mouseDownTime = pixelsToSeconds(this.mouseDownX, 1000, this.props.sampleRate);
      this.props.select(mouseDownTime, mouseDownTime);
    }

    handleSelectionTo = (e) => {
      if (this.mouseDownX) { // only when mouse down has occured
        // parent node is always the ImageChannelWrapper
        const bounds = e.target.parentNode.getBoundingClientRect();
        const mouseUp = e.clientX - bounds.left
        const mouseDownTime = pixelsToSeconds(this.mouseDownX, 1000, this.props.sampleRate);
        const mouseUpTime = pixelsToSeconds(mouseUp, 1000, this.props.sampleRate);
        // console.log('mouse at: ', e.clientX - bounds.left);
        if (mouseDownTime < mouseUpTime) {
          this.props.select(mouseDownTime, mouseUpTime);
        } else {
          this.props.select(mouseUpTime, mouseDownTime);
        }
      }
    }

    handleMouseMove = (e) => {
      e.preventDefault();
      this.handleSelectionTo(e);
    }

    handleMouseUp = (e) => {
      e.preventDefault();
      this.handleSelectionTo(e);
      this.mouseDownX = null; // finalize selection
    }

    handleMouseLeave = (e) => {
      e.preventDefault();
      this.handleSelectionTo(e);
      this.mouseDownX = null; // finalize selection
    }

    render() {
      // select props passed down to Channel
      const {sampleRate, buffer, playState, selection, select, setChannelPlayState, factor, ...passthruProps} = this.props;

      const progressPx = secondsToPixels(this.state.progress, 1000, sampleRate);
      const cursorPx = secondsToPixels(selection.from, 1000, sampleRate);
      const selectionPx = {
        from: cursorPx,
        to: secondsToPixels(selection.to, 1000, sampleRate)
      };

      // pass down props and progress
      return <WrappedComponent {...passthruProps} factor={ factor } handleMouseDown={ this.handleMouseDown } handleMouseUp={ this.handleMouseUp } handleMouseMove={ this.handleMouseMove }
               handleMouseLeave={ this.handleMouseLeave } progress={ progressPx } cursorPos={ cursorPx } selection={ selectionPx }
      />;
    }
  }
  ;

  WithImagePlay.propTypes = {
    sampleRate: PropTypes.number,
    buffer: PropTypes.object,
    playState: PropTypes.oneOf(['stopped', 'playing']),
    selection: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    setChannelPlayState: PropTypes.func.isRequired,
  }

  withImagePlay.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithImagePlay;
}


function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}