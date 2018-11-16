import React, { PureComponent } from 'react';
import Playout from '../player/Playout'
import { secondsToPixels } from '../utils/conversions';

// HOC to support audio playing if one Channel
export function withAudioPlay(WrappedComponent) {
  class WithPlayContext extends PureComponent {

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
      if (prevProps.audioData.playState !== this.props.audioData.playState) {
        if (this.props.audioData.playState === "playing") {
          this.playAudio();
        } else {
          this.stopAudio();
        }
      }
    }

    componentWillUnmount() {
      // clean up playout
      this.playout && this.playout.stop();
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
      const {audioData, ...passthruProps} = this.props;

      const progressPx = audioData.buffer ?
        secondsToPixels(this.state.progress, 1000, audioData.buffer.sampleRate) : 0;

      // pass down props and progress
      return <WrappedComponent {...passthruProps} progress={ progressPx } />;
    }
  }
  ;

  withAudioPlay.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithPlayContext;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}