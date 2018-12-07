import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MouseHandler from '../handler/MouseHandler';

import { secondsToPixels, pixelsToSeconds, samplesToSeconds } from '../utils/conversions';

// HOC to support image playing for one channel
export function withImagePlay(WrappedComponent) {
  class WithImagePlay extends PureComponent {

    constructor(props) {
      super(props);
      this.playState = "running";
      this.animationStartTime = null; // start time of internal animation timer, null means not playing
      this.playStartAt = 0; // start of current play
      this.playEndAt = 0; // end of current play
      this.selectFromTime = 0; // time of selection start
      this.state = {
        progress: 0, // play progress in secs
      };
      this.mousehandler = new MouseHandler({
        select: this.select, // use member func for px2time 
        move: this.move // use member func for px2time 
      })
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
      if (this.props.type !== "image") {
        return;
      }

      // regular start at startAt
      if (!this.isPlaying() && endAt >= startAt) {

        // act.. values is global time interval of this channel
        const actStartAt = Math.max(0, startAt); // dont start before 0
        const actEndAt = endAt - startAt < 0.1 ? samplesToSeconds(this.props.buffer.width, this.props.sampleRate) + offset : endAt; // TODO: 10 -> track duration

        // track.. values are local image time
        const trackStartAt = actStartAt - offset < 0 ? 0 : actStartAt - offset;
        const trackDelay = startAt - offset < 0 ? offset - startAt : 0;
        const trackEndAt = actEndAt - offset;

        // remeber for progress offset
        this.animateStartAt = actStartAt; 
        this.animateEndAt = endAt - startAt < 0.1 ? 
          this.props.maxDuration  + offset : trackEndAt + offset;
        
        if (trackEndAt > 0) {
          console.log(`playing image from ${trackStartAt}s( ${actStartAt}s) to ${trackEndAt}(${actEndAt}s) with delay ${trackDelay}, offset: ${offset}`);
          // TODO: do the image playing
        } else {
          console.log(`skip image playing from ${actStartAt}s to ${actEndAt}`);
        }

        // start progress animation
        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      }
    }

    animateProgress = (timestamp) => {
      if (!this.animationStartTime) {
        this.animationStartTime = timestamp;
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
    }


    isPlaying = () => {
      return this.animationStartTime !== null;
    }

    stopPlay = () => {
      this.stopAnimateProgress();
      this.animationStartTime = null;
      this.props.setChannelPlayState("stopped");
    }

    // transform from pixel to time values
    select = (fromPx, toPx) => {
      const from = pixelsToSeconds(fromPx, this.props.resolution, this.props.sampleRate);
      const to = pixelsToSeconds(toPx, this.props.resolution, this.props.sampleRate);
      this.props.select(from, to);
    }

    // transform from pixel to time values
    move = (incrX) => {
      const incr = pixelsToSeconds(incrX, this.props.resolution, this.props.sampleRate);
      this.props.move(incr);
    }
 
    render() {

      // select props passed down to Channel
      const {sampleRate, buffer, playState, selection, select, 
 		setChannelPlayState, resolution, mode, offset, maxDuration,
 		...passthruProps} = this.props;

      const offsetPx = secondsToPixels(offset, resolution, sampleRate)
      const progressPx = secondsToPixels(this.state.progress, resolution, sampleRate) - offsetPx;
      const cursorPx = secondsToPixels(selection.from, resolution, sampleRate) - offsetPx;
      const selectionPx = {
        from: cursorPx,
        to: secondsToPixels(selection.to, resolution, sampleRate) - offsetPx
      };
      const maxWidth = secondsToPixels(maxDuration, resolution, sampleRate);
      const factor = 1 / resolution;
      const lengthPx = buffer && buffer.width * factor;
      this.mousehandler.setMode(mode);

      // pass down props and progress
      return <WrappedComponent {...passthruProps} 
		offset={ offsetPx } 
		length={ lengthPx } 
		factor={ factor } 
		progress={ progressPx } 
		cursorPos={ cursorPx }
        selection={ selectionPx } 
        maxWidth = { maxWidth }
        handleMouseEvent={ this.mousehandler.handleMouseEvent } />;
    }
  }
  ;

  WithImagePlay.propTypes = {
    sampleRate: PropTypes.number.isRequired,
    resolution: PropTypes.number.isRequired,
    buffer: PropTypes.object.isRequired,
    maxDuration:  PropTypes.number.isRequired,
    playState: PropTypes.oneOf(['stopped', 'playing']).isRequired,
    selection: PropTypes.object.isRequired,
    offset: PropTypes.number.isRequired,
    select: PropTypes.func.isRequired,
    setChannelPlayState: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['selectionMode', 'moveMode']).isRequired,
  }

  withImagePlay.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithImagePlay;
}


function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}