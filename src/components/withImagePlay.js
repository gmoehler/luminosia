/* 
  Deals with image channel playing, progress & mouse handling
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MouseHandler from '../handler/MouseHandler';
import { timeToPixels } from './timeToPixels';

// HOC to support image playing for one channel
export function withImagePlay(WrappedComponent) {

  const WrappedComponentInTime = timeToPixels(WrappedComponent);

  class WithImagePlay extends PureComponent {

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
        move: this.move 
      })
    }

    componentDidUpdate(prevProps, prevState) {

      // offset is 0
      const {playState, selection} = this.props;

      // start or stop playing
      if (prevProps.playState !== playState) {
        if (playState === "playing") {
          this.startPlay(selection.from, selection.to, 0);
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
        const actEndAt = endAt - startAt < 0.1 ? this.props.maxDuration : endAt;

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
        // TODO: do the image playing
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
      this.stopAnimateProgress();
      this.props.setChannelPlayState("stopped");
    }

    select = (from, to) => {
      this.props.select(from, to);
    }

    move = (partId, incr) => {
      this.props.move(partId, incr);
      // select the part using markers
      const channelId = this.props.id;
      const part = this.props.parts[partId];
      const from = part.offset + incr;
      const to = part.offset + incr + part.duration;
      this.props.updateMarker(`${channelId}-${part.id}-l`, from);
      this.props.updateMarker(`${channelId}-${part.id}-r`, to);
    }

    render() {

      const {sampleRate, mode, ...passthruProps} = this.props;

      this.mousehandler.setMode(mode);
      const factor = this.props.resolution / sampleRate;

      // time to pixel conversion is done in HOC TimeToPixel
      return <WrappedComponentInTime 
        {...passthruProps} 
        progress={ this.state.progress }
        handleMouseEvent={ (pos, event) => this.mousehandler.handleMouseEvent(pos,event, this.props.resolution) } 
        factor={ factor }  
      />;
    }
  }
  ;

  WithImagePlay.propTypes = {
    sampleRate: PropTypes.number.isRequired,
    resolution: PropTypes.number.isRequired,
    playState: PropTypes.oneOf(['stopped', 'playing']).isRequired,
    selection: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    setChannelPlayState: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['selectionMode', 'moveMode']).isRequired,
    parts: PropTypes.array.isRequired,
    maxDuration: PropTypes.number.isRequired,
  }

  withImagePlay.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithImagePlay;
}


function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}