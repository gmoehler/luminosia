import React, {Component} from 'react';
import Playout from '../player/Playout'

export function withAudioContext(WrappedComponent) {
  class WithAudioContext extends Component {

    constructor(props) {
      super(props);
      this.playout = null;
      this.state = {
        isPlaying: false
      }
      this.playAudio.bind(this);
      this.stopAudio.bind(this);
    }

    componentDidMount() {
      // nothing to be done for now
    }

    componentWillUnmount() {
      // nothting to be done for now
    }

    playAudio() {
      //TODO: react on changing audiobuffers
      if (!this.playout) {
        this.playout = new Playout(this.props.audioContext, this.props.audioBuffer);
      }
      // TODO: set this.isPlaying back to false when play ends
      this.playout.setUpSource();
      this.playout.play(0, 0, 3);
      this.isPlaying = true;
    }

    stopAudio() {
      this.playout.stop();
      this.isPlaying = false;
    }

    render() {
      // ... and renders the wrapped component with the fresh data! Notice that we
      // pass through any additional props
      return <WrappedComponent
        playAudio={this.playAudio.bind(this)}
        stopAudio={this.stopAudio.bind(this)}
        {...this.props}/>;
    }
  };

  withAudioContext.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithAudioContext;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}