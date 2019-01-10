/* 
  HOC to support audio/image playing for one channel 
  also updates play progress in channel 
  and delegates mouse events to mouse handler
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import extractPeaks from 'webaudio-peaks';
import memoize from 'memoize-one';

import Playout from '../player/Playout';
import MouseHandler from '../handler/MouseHandler';
import { timeToPixels } from './timeToPixels';


export function withPlay(WrappedComponent) {

  const WrappedComponentInTime = timeToPixels(WrappedComponent);

  class WithPlay extends PureComponent {

    constructor(props) {
      super(props);
      this.animationStartTime = null; // start time of progress animation timer, null means not playing
      this.playStartAt = 0; // start of current play
      this.playEndAt = 0; // end of current play
      this.mousehandler = null;
      this.state = {
        progress: null, // play progress in secs
      };
    }

    componentDidMount() {
      // mouse handler setup
      this.mousehandler = new MouseHandler({
        select: this.props.select,
        move: this.props.move,
        updateMarker: this.props.updateMarker,
        setMarker: this.props.setMarker,
        addPartAndMarkers: this.props.addPartAndMarkers,
    });
      // audio setup
      if (this.props.type === "audio") { 
        this.playout = null;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new window.AudioContext();
      }
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
      if (!this.playout && this.audioContext) {
        this.playout = new Playout(this.audioContext, this.props.buffer);
      }

      // regular start at startAt
      if (!this.isPlaying() && endAt >= startAt) {

        // act.. values is global time interval of this channel
        const actOffset = offset? offset : 0;
        const actStartAt = Math.max(0, startAt); // dont start before 0
        const duration = this.props.buffer ? this.props.buffer.duration : this.props.maxDuration;
        const actEndAt = endAt - startAt < 0.1 ? duration + actOffset: endAt;

        // track.. values are local image time
        const trackStartAt = actStartAt - actOffset < 0 ? 0 : actStartAt - actOffset;
        const trackDelay = startAt - actOffset < 0 ? actOffset - startAt : 0;
        const trackEndAt = actEndAt - actOffset;

        // remeber for progress offset
        this.animateStartAt = actStartAt; 
        this.animateEndAt = endAt - startAt < 0.1 ? 
          this.props.maxDuration + actOffset : trackEndAt + actOffset;

        // only play if there is something to play and only for audio (for now)
        if (trackEndAt > 0 && this.playout) {
          console.log(`playing ${this.props.type} from ${trackStartAt}s( ${actStartAt}s) ` 
            + `to ${trackEndAt}(${actEndAt}s) with delay ${trackDelay}, offset: ${actOffset}, delay ${trackDelay}`);

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

    // only re-calc when buffer, resolution of bits change
    doExtractPeaks = memoize(
      (buffer, pixPerSample, bits) => extractPeaks(buffer, pixPerSample, true, 0, buffer.length, bits));

    render() {

      const {buffer, mode, sampleRate, ...passthruProps} = this.props;

      if (this.mousehandler) {
        this.mousehandler.setMode(mode);
      }

      // memoized audio peak data
      const {data, length, bits} = buffer ? this.doExtractPeaks(buffer, sampleRate / this.props.resolution, 16) 
        : {data: [], length: 0, bits: 0};
      const peaksDataMono = Array.isArray(data) ? data[0] : []; // only one channel for now

      // time to pixel conversion is done in HOC TimeToPixel
      return <WrappedComponentInTime 
        {...passthruProps} 
        progress={ this.state.progress }
        handleMouseEvent={ (eventName, evInfo) => this.mousehandler.handleMouseEvent(eventName, evInfo, this.props.resolution) } 
        factor={ this.props.resolution / sampleRate }  /* req only for images */
        peaks={ peaksDataMono } /* only for audio */
        bits={ bits } /* only for audio */
        length={ length } /* only for audio */
      />;
    }
  }
  ;

  WithPlay.propTypes = {
    sampleRate: PropTypes.number.isRequired,
    resolution: PropTypes.number.isRequired,
    playState: PropTypes.oneOf(['stopped', 'playing']).isRequired,
    selection: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    setChannelPlayState: PropTypes.func.isRequired,
    setMarker: PropTypes.func.isRequired,
    updateMarker: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['selectionMode', 'moveMode']).isRequired,
    parts: PropTypes.array,
    maxDuration: PropTypes.number,
  }

  withPlay.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithPlay;
}


function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}