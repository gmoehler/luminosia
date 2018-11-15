import React, { PureComponent } from 'react';
import Playout from '../player/Playout'

export function withPlayContext(WrappedComponent) {
  class WithPlayContext extends PureComponent {

    constructor(props) {
      super(props);
      this.playout = null;
      this.startTime = 0;
      this.state = {
        progress: 0,
        pause: false
      };
      this.stopAnimateProgress = this.stopAnimateProgress.bind(this);
      this.animateProgress = this.animateProgress.bind(this);
      this.playAudio = this.playAudio.bind(this);
      this.stopAudio = this.stopAudio.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
      if (prevProps.audio.playState !== this.props.audio.playState) {
        if (this.props.audio.playState === "playing") {
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
        this.playout = new Playout(this.props.audioContext, this.props.audio.buffer);
      }
      if (!this.isPlaying()) {
        this.playout.setUpSource()
          .then(this.stopAnimateProgress); // TODO: more checking, might be started again
        this.playout.play(0, 0, 10);

        this.startTime = this.props.audioContext.currentTime;
        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      }
    }

    animateProgress() {
      this.setState({
        progress: this.props.audioContext.currentTime - this.startTime
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
      const { audioBuffer, ...passthruProps } = this.props;
      // pass through any additional props
      return <WrappedComponent
        playAudio={this.playAudio}
        stopAudio={this.stopAudio}
        progress={this.state.progress}
        {...passthruProps} />;
    }
  }
  ;

  withPlayContext.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithPlayContext;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}