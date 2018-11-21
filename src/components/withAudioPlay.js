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
      this.startTime = 0;
      this.state = {
        progress: 0,            // play progress in secs
        playState: "stopped",   // play state: stopped / playing
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

    static getDerivedStateFromProps(props, state){
      const {playState} = props;
      return ({
        ...state, 
        playState
      });
    }

    componentDidUpdate(prevProps, prevState) {
      // start or stop playing
      if (prevProps.playState !== this.props.playState) {
        if (this.props.playState === "playing") {
          const startTime = this.props.selection.from;
          this.playAudio(startTime);
        } else {
          this.stopAudio();
        } 
      }
      // jump to new play position
      else if (this.props.playState === "playing" 
        && this.props.selection.from !== prevProps.selection.from) {
        this.playAudio(this.props.selection.from);
      } 
    }

    componentWillUnmount() {
      // clean up playout and animation
      this.stopAudio();
    }

    playAudio(startAt, delay=0) {
      if (!this.playout) {
        this.playout = new Playout(this.audioContext, this.props.buffer);
      }
      
      // regular start at startAt
      if (!this.isPlaying()) {
        this.playout.setUpSource()
          .then(this.stopAudio); 
        console.log(`start playing at ${startAt}s with delay ${delay}`);
        this.playout.play(delay, startAt, 10);

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
      if (this.state.shouldRestart) {
        // reset shouldRestart state
        this.setState({...this.state, shouldRestart: false});
        // and restart playing
        this.playAudio(this.props.selection.from, 0.05);
      }
    }

    handleClick = (e) => {
      var bounds = e.target.getBoundingClientRect();
      var x = e.clientX - bounds.left;
      // var y = e.clientY - bounds.top;
      // console.log('clicked at: ', x, y);
      // position cursor at click
      const clickTime = pixelsToSeconds(x, 1000, this.props.sampleRate);
      this.props.select(clickTime, clickTime);
    }

    render() {
      // stop passing audioData props down to Channel
      const {audioData, playState, ...passthruProps} = this.props;

      const progressPx = secondsToPixels(this.state.progress, 1000, this.props.sampleRate);
      const cursorPx = secondsToPixels(this.props.selection.from, 1000, this.props.sampleRate);

      // pass down props and progress
      return <WrappedComponent {...passthruProps}
        handleClick={this.handleClick} 
        progress={ progressPx } 
        cursorPos={ cursorPx } />;
    }
  };

  WithAudioPlay.propTypes = {
    sampleRate: PropTypes.number,
    buffer: PropTypes.object,
    playState: PropTypes.oneOf(['stopped', 'playing']),
    selection: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
  }

  withAudioPlay.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithAudioPlay;
}


function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}