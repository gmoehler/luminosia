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
        progress: 0
      };
      this.stopAnimateProgress = this.stopAnimateProgress.bind(this);
      this.animateProgress = this.animateProgress.bind(this);
      this.playAudio = this.playAudio.bind(this);
      this.stopAudio = this.stopAudio.bind(this);

      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new window.AudioContext();
    }

    static getDerivedStateFromProps(props, state){
      const {audioData, playState} = props;
      return ({
        ...state, 
        sampleRate: (audioData && audioData.buffer) ? audioData.buffer.sampleRate : 0,
        buffer: audioData && audioData.buffer, 
        playState
      });
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.playState !== this.props.playState) {
        if (this.props.playState === "playing") {
          const startTime = this.props.startAt ? this.props.startAt : 0;
          this.playAudio(startTime);
        } else {
          this.stopAudio();
        }
      } else if (this.props.playState === "playing" && this.props.startAt !== prevProps.startAt) {
        // jumpt to new position
        this.playAudio(this.props.startAt);
      } 
    }

    componentWillUnmount() {
      // clean up playout and animation
      this.stopAudio();
    }

    playAudio(startAt, delay=0) {
      if (!this.playout) {
        this.playout = new Playout(this.audioContext, this.state.buffer);
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
        this.setState({...this.state, restart: true, restartAt: startAt});
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
      if (this.state.restart) {
        const startAt = this.state.restartAt;
        // reset state
        this.setState({...this.state, restart: false, restartAt: 0});
        // and restart
        this.playAudio(startAt, 0.05);
      }
    }

    handleClick = (e) => {
      var bounds = e.target.getBoundingClientRect();
      var x = e.clientX - bounds.left;
      var y = e.clientY - bounds.top;
      console.log('clicked at: ', x, y);
      // start playing audio at click point
      this.props.playAudio(pixelsToSeconds(x, 1000, this.state.sampleRate));
    }

    render() {
      // stop passing audioData props down to Channel
      const {audioData, playState, ...passthruProps} = this.props;

      const progressPx = this.state.sampleRate > 0 ? 
        secondsToPixels(this.state.progress, 1000, this.state.sampleRate) : 0;

      // pass down props and progress
      return <WrappedComponent {...passthruProps}
        handleClick={this.handleClick} 
        progress={ progressPx } 
        cursorPos={ progressPx } />;
    }
  };

  WithAudioPlay.propTypes = {
    audioData: PropTypes.array,
    playState: PropTypes.oneOf(['stopped', 'playing']),
    startAt: PropTypes.number,
    playAudio: PropTypes.func.isRequired,
  }

  withAudioPlay.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithAudioPlay;
}


function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}