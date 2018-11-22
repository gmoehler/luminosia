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
      this.mouseDownX = 0;      // x of mouse down event
      this.state = {
        progress: 0,            // play progress in secs
        shouldRestart: false,   // trigger for restart after stop to enable jumps
      };
      // class functions
      this.animateProgress = this.animateProgress.bind(this);
      this.stopAnimateProgress = this.stopAnimateProgress.bind(this);
      this.playAudio = this.playAudio.bind(this);
      this.stopAudio = this.stopAudio.bind(this);

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new window.AudioContext();
    }

    /* static getDerivedStateFromProps(props, state){
      const {playState} = props;
      return ({
        ...state, 
        playState
      });
    } */

    componentDidUpdate(prevProps, prevState) {
    	
      const { playState, selection } = this.props;
    
      // start or stop playing
      if (prevProps.playState !== playState) {
        if (playState === "playing") {
          this.playAudio(selection.from, selection.to);
        } 
        // only stopped if not already (auto)stopped
        else if (playState !== "stopped") {
          this.stopAudio();
        } 
      }
      // jump to new play position
      else if (playState === "playing" 
        && prevProps.selection.from !== selection.from) {
        this.playAudio(selection.from, selection.to);
      } 
    }

    componentWillUnmount() {
      // clean up playout and animation
      this.stopAudio();
    }

    playAudio(startAt, endAt, delay=0) {
      if (!this.playout) {
        this.playout = new Playout(this.audioContext, this.props.buffer);
      }
      
      // regular start at startAt
      if (!this.isPlaying()) {
        this.playout.setUpSource()
          .then(this.stopAudio); 
        console.log(`start playing at ${startAt}s with delay ${delay}`);
        const duration = endAt && Math.abs(endAt - startAt) > 0.1 ? endAt - startAt : 10;
        this.playout.play(delay, startAt, duration);

        // remember time when audio would have started at 0
        this.startTime = this.audioContext.currentTime - startAt;
        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      }
      else {
        // remember wake-up for restart after audio has stopped
        this.setState({...this.state, shouldRestart: true});
        this.stopAudio();
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
      if (this.state.shouldRestart) {
        // reset shouldRestart state
        this.setState({...this.state, shouldRestart: false});
        // and restart playing
        this.playAudio(this.props.selection.from, this.props.selection.to);
      }
    }

    handleMouseDown = (e) => {
      e.preventDefault();
      var bounds = e.target.getBoundingClientRect();
      this.mouseDownX = e.clientX - bounds.left;
      console.log('mouse down at: ', this.mouseDownX);
    }

    handleMouseUp = (e) => {
      e.preventDefault();
      const bounds = e.target.getBoundingClientRect();
      const mouseUp = e.clientX - bounds.left
      if (mouseUp >= 1){ // ignore clicks on the cursor 
        const mouseDownTime = pixelsToSeconds(this.mouseDownX, 1000, this.props.sampleRate);
        const mouseUpTime = pixelsToSeconds(mouseUp, 1000, this.props.sampleRate);
        console.log('mouse up at: ', e.clientX - bounds.left);
        if (mouseDownTime < mouseUpTime){
          this.props.select(mouseDownTime, mouseUpTime);
        } else {
          this.props.select(mouseUpTime, mouseDownTime);
        }
      }
    }

    render() {
      // stop some props from bring passed down to Channel
      const {sampleRate, buffer, playState, 
		selection, select, setChannelPlayState,
		...passthruProps} = this.props;

      const progressPx = secondsToPixels(this.state.progress, 1000, sampleRate);
      const cursorPx = secondsToPixels(selection.from, 1000, sampleRate);
      const selectionPx = {from: cursorPx, 
        to: secondsToPixels(selection.to, 1000, sampleRate)};

      // pass down props and progress
      return <WrappedComponent {...passthruProps}
        handleMouseDown={this.handleMouseDown}
        handleMouseUp={this.handleMouseUp}
        progress={ progressPx } 
        cursorPos={ cursorPx } 
        selection={ selectionPx} />;
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