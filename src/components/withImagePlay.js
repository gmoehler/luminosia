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
      this.selectFromTime = 0; // time of selection start
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

    getMouseEventX = (e) => {
      // parent node is always the ChannelWrapper
      const bounds = e.target.parentNode.getBoundingClientRect();
      return Math.max(0, e.clientX - bounds.left);
    }

    getMouseEventTime = (e) => {
      const x = this.getMouseEventX(e);
      return pixelsToSeconds(x, this.props.resolution, this.props.sampleRate);
    }

    // start selection
    handleSelectionFrom = (eventTime) => {
      this.selectFromTime = eventTime;
      this.props.select(eventTime, eventTime);
    }

    handleSelectionTo = (eventTime, finalizeSelection) => {
      if (this.selectFromTime) { // only when mouse down has occured
        // console.log('mouse at: ', e.clientX - bounds.left);
        if (this.selectFromTime < eventTime) {
          this.props.select(this.selectFromTime, eventTime);
        } else {
          this.props.select(eventTime, this.selectFromTime);
        }
        if (finalizeSelection) {
          this.selectFromTime = null; 
        }
      }
    }

    handleMouseDown = (e) => {
      e.preventDefault();
      const eventTime = this.getMouseEventTime(e);
      this.handleSelectionFrom(eventTime);
    }

    handleMouseMove = (e) => {
      e.preventDefault();
      const eventTime = this.getMouseEventTime(e);
      this.handleSelectionTo(eventTime, false);
    }

    handleMouseUp = (e) => {
      e.preventDefault();
      const eventTime = this.getMouseEventTime(e);
      this.handleSelectionTo(eventTime, true);
    }

    handleMouseLeave = (e) => {
      e.preventDefault();
      const eventTime = this.getMouseEventTime(e);
      this.handleSelectionTo(eventTime, true);
    } 

    render() {

      // select props passed down to Channel
      const {sampleRate, buffer, playState, selection, select, setChannelPlayState, resolution, 
        ...passthruProps} = this.props;

      const progressPx = secondsToPixels(this.state.progress, resolution, sampleRate);
      const cursorPx = secondsToPixels(selection.from, resolution, sampleRate);
      const selectionPx = {
        from: cursorPx,
        to: secondsToPixels(selection.to, resolution, sampleRate)
      };
      const factor = 1/resolution;
      const length = buffer && buffer.width * factor;

      // pass down props and progress
      return <WrappedComponent {...passthruProps} 
        left={0}
        length={ length }
        factor={ factor } 
        progress={ progressPx } 
        cursorPos={ cursorPx } 
        selection={ selectionPx }
        handleMouseDown={ this.handleMouseDown } 
        handleMouseUp={ this.handleMouseUp } 
        handleMouseMove={ this.handleMouseMove }
        handleMouseLeave={ this.handleMouseLeave } 
      />;
    }
  }
  ;

  WithImagePlay.propTypes = {
    sampleRate: PropTypes.number.isRequired,
    resolution: PropTypes.number.isRequired,
    buffer: PropTypes.object.isRequired,
    playState: PropTypes.oneOf(['stopped', 'playing']).isRequired,
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