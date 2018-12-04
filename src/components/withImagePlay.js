import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MouseHandler from '../handler/SelectionMouseHandler'

import { secondsToPixels, pixelsToSeconds } from '../utils/conversions';

// HOC to support image playing for one channel
export function withImagePlay(WrappedComponent) {
  class WithImagePlay extends PureComponent {

    constructor(props) {
      super(props);
      this.playState = "running";
      this.startTime = 0; // start time of current play
      this.endTime = 0; // end time of current play
      this.animationStartTime = null; // start time of internal animation timer, null means not playing
      this.selectFromTime = 0; // time of selection start
      this.state = {
        progress: 0, // play progress in secs
      };
      this.mousehandler = new MouseHandler(
        {
          select: this.select,
        },
      );

      // class functions
      this.animateProgress = this.animateProgress.bind(this);
      this.stopAnimateProgress = this.stopAnimateProgress.bind(this);
      this.startPlay = this.startPlay.bind(this);
      this.stopPlay = this.stopPlay.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {

      const {playState, selection} = this.props;

      // start or stop playing
      if (prevProps.playState !== playState) {
        if (playState === "playing") {
          this.startPlay(selection.from, selection.to);
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

    startPlay(startAt, endAt) {
      if (this.props.type !== "image") {
        return;
      }

      // regular start at startAt
      if (!this.isPlaying()) {
        this.startTime = Math.max(0, startAt);
        const duration = endAt && Math.abs(endAt - this.startTime) > 0.1 ? endAt - this.startTime : 10;
        this.endTime = this.startTime + duration;
        console.log(`playing image from ${this.startTime}s to ${this.endTime}`);

        // nothing to be done for playing right now

        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      }
    }

    animateProgress(timestamp) {
      if (!this.animationStartTime) {
        this.animationStartTime = timestamp;
      }
      const duration = timestamp - this.animationStartTime;
      const currentTimeInSecs = this.startTime + duration / 1000.0;
      this.setState({
        ...this.state,
        progress: currentTimeInSecs
      });
      if (currentTimeInSecs < this.endTime) {
        this.animationRequest = window.requestAnimationFrame(this.animateProgress);
      } else {
        this.stopPlay();
      }
    }

    stopAnimateProgress() {
      window.cancelAnimationFrame(this.animationRequest);
    }


    isPlaying() {
      return this.animationStartTime !== null;
    }

    stopPlay() {
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
    
    render() {

      // select props passed down to Channel
      const {sampleRate, buffer, playState, selection, select, setChannelPlayState, resolution, ...passthruProps} = this.props;

      const offset = secondsToPixels(this.props.offset, this.props.resolution, sampleRate)
      const progressPx = secondsToPixels(this.state.progress, resolution, sampleRate) - offset;
      const cursorPx = secondsToPixels(selection.from, resolution, sampleRate) - offset;
      const selectionPx = {
        from: cursorPx,
        to: secondsToPixels(selection.to, resolution, sampleRate) - offset
      };
      const factor = 1 / resolution;
      const length = buffer && buffer.width * factor;

      // pass down props and progress
      return <WrappedComponent {...passthruProps} offset={ offset } length={ length } factor={ factor } progress={ progressPx } cursorPos={ cursorPx }
               selection={ selectionPx } handleMouseEvent={ this.mousehandler.handleMouseEvent } />;
    }
  }
  ;

  WithImagePlay.propTypes = {
    sampleRate: PropTypes.number.isRequired,
    resolution: PropTypes.number.isRequired,
    buffer: PropTypes.object.isRequired,
    playState: PropTypes.oneOf(['stopped', 'playing']).isRequired,
    selection: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    setChannelPlayState: PropTypes.func.isRequired,
  }

  withImagePlay.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithImagePlay;
}


function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}