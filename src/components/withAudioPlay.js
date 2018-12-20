/* 
  Deals with audio channel playing, progress & mouse handling
  Also does time (in secs) to pixel conversion
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import extractPeaks from 'webaudio-peaks';
import memoize from 'memoize-one';

import Playout from '../player/Playout'
import MouseHandler from '../handler/SelectionMouseHandler'
import { timeToPixels } from './timeToPixels';

// HOC to support audio playing for one channel
export function withAudioPlay(WrappedComponent) {

  const WrappedComponentInTime = timeToPixels(WrappedComponent);

  class WithAudioPlay extends PureComponent {

    constructor(props) {
      super(props);
      this.animationStartTime = null; // start time of progress animation timer, null means not playing
      this.playStartAt = 0; // start of current play
      this.playEndAt = 0; // end of current play
      this.state = {
        progress: null, // play progress in secs
      };
      this.mousehandler = new MouseHandler({
          select: this.select,
      });

      // audio setup
      this.playout = null;
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new window.AudioContext();
    }

    componentDidUpdate(prevProps, prevState) {

      const {playState, selection, offset} = this.props;

      // start or stop playing
      if (prevProps.playState !== playState) {
        if (playState === "playing") {
          this.startPlay(selection.from, selection.to, offset);
        }
        // only stopped if not already (auto)stopped
        else if (this.isPlaying()) {
          this.stopPlay();
        }
      }
    }

    componentWillUnmount() {
      // clean up playout and animation
      if (this.isPlaying()) {
        this.stopPlay();
      }
    }

    startPlay = (startAt, endAt, offset) => {
      if (this.props.type !== "audio") {
        return;
      }
      if (!this.playout) {
        this.playout = new Playout(this.audioContext, this.props.buffer);
      }

      // regular start at startAt
      if (!this.isPlaying() && endAt >= startAt) {

        // act.. values is global time interval of this channel
        const actStartAt = Math.max(0, startAt); // dont start before 0
        const actEndAt = endAt - startAt < 0.1 ? this.props.buffer.duration + offset: endAt;

        // track.. values are local image time
        const trackStartAt = actStartAt - offset < 0 ? 0 : actStartAt - offset;
        const trackDelay = startAt - offset < 0 ? offset - startAt : 0;
        const trackEndAt = actEndAt - offset;

        // remeber for progress offset
        this.animateStartAt = actStartAt; 
        this.animateEndAt = endAt - startAt < 0.1 ? 
          this.props.maxDuration + offset : trackEndAt + offset;

        // only play if there is something to play
        if (trackEndAt > 0) {
          console.log(`playing ${this.props.type} from ${trackStartAt}s( ${actStartAt}s) ` 
            + `to ${trackEndAt}(${actEndAt}s) with delay ${trackDelay}, offset: ${offset}, delay ${trackDelay}`);
          this.playout.setUpSource()
            .then(this.stopPlay); // stop when end has reached
            
          const duration = actEndAt - actStartAt;  
          this.playout.play(this.audioContext.currentTime + trackDelay, trackStartAt, duration);
        } else {
          console.log(`skip  ${this.props.type} playing from ${actStartAt}s to ${actEndAt}`);
        }

        // start progress animation
        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      }
    }

    animateProgress = (timestamp) => {
      if (!this.animationStartTime) {
        this.animationStartTime = timestamp;
        //TODO: sync with playout time
      }

      const duration = timestamp - this.animationStartTime;
      const currentTimeInSecs = this.animateStartAt + duration / 1000.0;

      this.setState({
        ...this.state,
        progress: currentTimeInSecs
      })
      
      if (currentTimeInSecs < this.animateEndAt) {
        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      } else {
        this.stopPlay();
      }
    }

    stopAnimateProgress = () => {
      window.cancelAnimationFrame(this.animationRequest);
      this.setState({
        ...this.state,
        progress: null
      })
      this.animationStartTime = null;
    }

    isPlaying = () => {
      return this.animationStartTime !== null;
    }

    stopPlay = () => {
      this.playout && this.playout.stop();
      this.stopAnimateProgress();
      this.props.setChannelPlayState("stopped");
    }

    select = (from, to) => {
      this.props.select(from, to);
    }

    // only re-calc when buffer, resolution of bits change
    doExtractPeaks = memoize(
      (buffer, pixPerSample, bits) => extractPeaks(buffer, pixPerSample, true, 0, buffer.length, bits));

    render() {

      const {buffer, mode, sampleRate, ...passthruProps} = this.props;

      // memoized peak data
      const {data, length, bits} = this.doExtractPeaks(buffer, sampleRate / this.props.resolution, 16);
      const peaksDataMono = Array.isArray(data) ? data[0] : []; // only one channel for now

      return <WrappedComponentInTime 
        {...passthruProps} 
        progress={ this.state.progress }
        handleMouseEvent={ (pos, event) => this.mousehandler.handleMouseEvent(pos,event, this.props.resolution) } 
        peaks={ peaksDataMono } 
        bits={ bits } 
        length={ length } 
      />;
    }
  }
  ;

  WithAudioPlay.propTypes = {
    sampleRate: PropTypes.number.isRequired,
    resolution: PropTypes.number.isRequired,
    playState: PropTypes.oneOf(['stopped', 'playing']).isRequired,
    selection: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    setChannelPlayState: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['selectionMode', 'moveMode']).isRequired,
  }

  withAudioPlay.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithAudioPlay;
}


function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}