import React, {Component} from 'react';
import Playout from '../player/Playout'

export function withPlayContext(WrappedComponent) {
  class WithPlayContext extends Component {

    constructor(props) {
      super(props);
      this.playout = null;
    }

    componentDidMount() {
      // nothing to be done for now
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
      if (!this.playout.isPlaying()) {
        this.playout.setUpSource();
        this.playout.play(0, 17, 3);
      }
    }

    isPlaying() {
      return this.playout && this.playout.isPlaying();
    }

    stopAudio() {
      this.playout && this.playout.stop();
    }

    render() {
      const {audioBuffer, ...passthruProps} = this.props;
      // pass through any additional props
      return <WrappedComponent
        playAudio={this.playAudio.bind(this)}
        stopAudio={this.stopAudio.bind(this)}
        {...passthruProps}/>;
    }
  };

  withPlayContext.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithPlayContext;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}