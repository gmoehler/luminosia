import { Component } from 'react';
import PropTypes from 'prop-types';
import Playout from '../player/Playout'

class PlayoutHandler extends Component {
  constructor(props) {
    super(props);
    this.audioContext = props.audioContext;
    this.playout = null;
    this.state = {
      isPlaying: false
    }
  }

  startPlaying() {
    //TODO: react on changing channelBuffers
    if (!this.playout) {
      this.playout = new Playout(this.audioContext, this.props.channelBuffer);
    }
    // TODO: set this.isPlaying back to false when play ends
    this.playout.setUpSource();
    this.playout.play(0, 0, 3);
    this.isPlaying = true;
  }

  stopPlaying() {
    this.playout.stop();
    this.isPlaying = false;
  }

  // needed because we react cannot find out for headless component
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.playing !== this.props.playing;
  }

  componentDidMount() {
    if (!this.isPlaying && this.props.playing) {
      this.startPlaying();
    } else if (this.isPlaying && !this.props.playing) {
      this.stopPlaying();
    }
  }

  componentDidUpdate() {
    if (!this.isPlaying && this.props.playing) {
      this.startPlaying();
    } else if (this.isPlaying && !this.props.playing) {
      this.stopPlaying();
    }
  }

  render() {
    return null;
  }
}

PlayoutHandler.propTypes = {
  audioContext: PropTypes.object,
  channelBuffer: PropTypes.object,
  playing: PropTypes.bool,
};

export default PlayoutHandler;
