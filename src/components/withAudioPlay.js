import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Playout from '../player/Playout'
import { secondsToPixels } from '../utils/conversions';

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

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.playState !== this.props.playState) {
        if (this.props.playState === "playing") {
          this.playAudio();
        } else {
          this.stopAudio();
        }
      }
    }

    componentWillUnmount() {
      // clean up playout and animation
      this.stopAudio();
    }

    playAudio() {
      //TODO: react on changing audiobuffers
      if (!this.playout) {
        this.playout = new Playout(this.audioContext, this.props.audioData.buffer);
      }
      if (!this.isPlaying()) {
        this.playout.setUpSource()
          .then(this.stopAnimateProgress); // TODO: more checking, might be started again in meantime
        this.playout.play(0, 0, 10);

        this.startTime = this.audioContext.currentTime;
        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      }
    }

    animateProgress() {
      this.setState({
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
    }

    render() {
      // stop passing audioData props down to Channel
      const {audioData, playState, ...passthruProps} = this.props;

      const progressPx = audioData && audioData.buffer ?
        secondsToPixels(this.state.progress, 1000, audioData.buffer.sampleRate) : 0;

      // pass down props and progress
      return <WrappedComponent {...passthruProps} progress={ progressPx } />;
    }
  };

  WithAudioPlay.propTypes = {
    audioData: PropTypes.array,
    playState: PropTypes.oneOf(['stopped', 'playing'])
  }

  withAudioPlay.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithAudioPlay;
}


function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}