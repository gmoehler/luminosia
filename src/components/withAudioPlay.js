import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Playout from '../player/Playout'
import { secondsToPixels, pixelsToSamples, pixelsToSeconds } from '../utils/conversions';

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
          this.setState({
            ...this.state,
            startAt: startTime
          })
          this.playAudio(startTime);
        } else {
          this.stopAudio();
        }
      }
    }

    componentWillUnmount() {
      // clean up playout and animation
      this.stopAudio();
    }

    playAudio(startAt) {
      if (!this.playout) {
        this.playout = new Playout(this.audioContext, this.state.buffer);
      }
      //TODO: think about jump to when playing
      if (!this.isPlaying()) {
        this.playoutPromise = this.playout.setUpSource();
        this.playoutPromise
          .then(this.stopAnimateProgress); // TODO: more checking, might be started again in meantime
        console.log(`start playing at ${startAt}s`);
        this.playout.play(0, startAt, 10);

        this.startTime = this.audioContext.currentTime;
        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      }
    }

    animateProgress() {
      this.setState({
        ...this.state,
        progress: this.audioContext.currentTime - this.startTime + this.state.startAt
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
    }

    handleClick = (e) => {
      var bounds = e.target.getBoundingClientRect();
      var x = e.clientX - bounds.left;
      var y = e.clientY - bounds.top;
      console.log('clicked at: ', x, y);
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