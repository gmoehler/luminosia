import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Playout from '../player/Playout'
import { secondsToPixels, pixelsToSeconds } from '../utils/conversions';

// HOC to support audio playing for one channel
export function withAudioPlay(WrappedComponent) {
  class WithAudioPlay extends PureComponent {

    constructor(props) {
      super(props);
      this.playout = null;
      this.startTime = 0;       // start time of current play
      this.mouseDownX = 0;      // x in px of mouse down event
      this.state = {
        progress: 0,            // play progress in secs
      };
      // class functions
      this.animateProgress = this.animateProgress.bind(this);
      this.stopAnimateProgress = this.stopAnimateProgress.bind(this);
      this.playAudio = this.playAudio.bind(this);
      this.stopAudio = this.stopAudio.bind(this);

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new window.AudioContext();
    }

    componentDidUpdate(prevProps, prevState) {
    	
      const { playState, selection } = this.props;
    
      // start or stop playing
      if (prevProps.playState !== playState) {
        if (playState === "playing") {
          this.playAudio(selection.from, selection.to);
        } 
        // only stopped if not already (auto)stopped
        else if (this.isPlaying())  {
          this.stopAudio();
        } 
      }
    }

    componentWillUnmount() {
      // clean up playout and animation
      if (this.isPlaying())  {
        this.stopAudio();
      } 
    }

    playAudio(startAt, endAt, delay=0) {
      if (!this.playout) {
        this.playout = new Playout(this.audioContext, this.props.buffer);
      }
      
      // regular start at startAt
      if (!this.isPlaying()) {
        const actStartAt = Math.max(0, startAt);
        console.log(`playing from ${actStartAt}s to ${endAt} with delay ${delay}`);
        this.playout.setUpSource()
          .then(this.stopAudio);  // stop when end has reached
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

    stopAudio() {
      this.playout && this.playout.stop();
      this.stopAnimateProgress();
      this.props.setChannelAudioState("stopped");
    }

    // start selection
    handleMouseDown = (e) => {
      e.preventDefault();
      var bounds = e.target.getBoundingClientRect();
      this.mouseDownX = e.clientX - bounds.left;
      // console.log('mouse down at: ', this.mouseDownX);
    }

    handleSelectionTo = (e) => {
      if (this.mouseDownX) { // only when mouse down has occured
        const bounds = e.target.getBoundingClientRect();
        const mouseUp = e.clientX - bounds.left
        if (mouseUp >= 1){ // ignore clicks on the cursor 
          const mouseDownTime = pixelsToSeconds(this.mouseDownX, 1000, this.props.sampleRate);
          const mouseUpTime = pixelsToSeconds(mouseUp, 1000, this.props.sampleRate);
          // console.log('mouse at: ', e.clientX - bounds.left);
          if (mouseDownTime < mouseUpTime){
            this.props.select(mouseDownTime, mouseUpTime);
          } else {
            this.props.select(mouseUpTime, mouseDownTime);
          }
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
      const {sampleRate, buffer, playState, selection, select, setChannelPlayState,
	    	...passthruProps} = this.props;

      const progressPx = secondsToPixels(this.state.progress, 1000, sampleRate);
      const cursorPx = secondsToPixels(selection.from, 1000, sampleRate);
      const selectionPx = {from: cursorPx, 
        to: secondsToPixels(selection.to, 1000, sampleRate)};

      // pass down props and progress
      return <WrappedComponent {...passthruProps}
        handleMouseDown={this.handleMouseDown}
        handleMouseUp={this.handleMouseUp}
        handleMouseMove={this.handleMouseMove}
        handleMouseLeave={this.handleMouseLeave}
        progress={ progressPx } 
        cursorPos={ cursorPx } 
        selection={ selectionPx } />;
    }
  };

  WithAudioPlay.propTypes = {
    sampleRate: PropTypes.number,
    buffer: PropTypes.object,
    playState: PropTypes.oneOf(['stopped', 'playing']),
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