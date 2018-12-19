/* 
  Deals with time (in secs) to pixel conversion
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash'

import { secondsToPixels, pixelsToSeconds } from '../utils/conversions';

// HOC to support time to pixel conversion for one channel
export function timeToPixels(WrappedComponent) {
  class TimeToPixels extends PureComponent {

    select = (fromPx, toPx) => {
      if (this.props.select) {
        const from = pixelsToSeconds(fromPx, this.props.resolution, this.props.sampleRate);
        const to = pixelsToSeconds(toPx, this.props.resolution, this.props.sampleRate);
        this.props.select(from, to);
      }
    }
    
    move = (partId, incrX) => {
      if (this.props.move) {
        const incr = pixelsToSeconds(incrX, this.props.resolution, this.props.sampleRate);
        this.props.move(partId, incr);
      }
    }
    
    handleMouseEvent = (posX, eventName) => {
      if (this.props.handleMouseEvent) {
    	  const pos = pixelsToSeconds(posX, this.props.resolution, this.props.sampleRate);
        this.props.handleMouseEvent(pos, eventName);
      }
    }

    render() {

      const {sampleRate, resolution, 
      	progress, cursorPos, selection, maxDuration, parts,
		    select, move, handleMouseEvent,
		    ...passthruProps} = this.props;

      const progressPx = progress ? secondsToPixels(progress, resolution, sampleRate) : null;
      const cursorPosPx = cursorPos ? secondsToPixels(cursorPos, resolution, sampleRate) : null;
      const selectionPx = selection ? {
        from: selection.from ? secondsToPixels(selection.from, resolution, sampleRate): null,
        to: selection.to ? secondsToPixels(selection.to, resolution, sampleRate): null
      } : null;
      const maxWidthPx = secondsToPixels(maxDuration, resolution, sampleRate);
      const partsPx = parts ? cloneDeep(parts) : [];
	    partsPx.forEach(part => {
        part.offset = part.offset ? secondsToPixels(part.offset, resolution, sampleRate) : null;
        part.duration = part.duration ? secondsToPixels(part.duration, resolution, sampleRate) : null;
      	part.cuein = part.cuein ? secondsToPixels(part.cuein, resolution, sampleRate) : null;
      	part.cueout = part.cueout ? secondsToPixels(part.cueout, resolution, sampleRate) : null;
      })

      return <WrappedComponent 
        {...passthruProps} 
        
        progress={ progressPx } 
        cursorPos={ cursorPosPx } 
        selection={ selectionPx }
            maxWidth={ maxWidthPx } 
            parts={ partsPx } 

        select={this.select}
        move={this.move}
        handleMouseEvent={ this.handleMouseEvent } 

        />;
      }
    }
  ;

  TimeToPixels.propTypes = {
    sampleRate: PropTypes.number.isRequired,
    resolution: PropTypes.number.isRequired,
    
    progress: PropTypes.number.isRequired,
    cursorPos: PropTypes.number.isRequired,
    selection: PropTypes.object.isRequired,
    maxDuration: PropTypes.number.isRequired,
    parts: PropTypes.array.isRequired,
    
    select: PropTypes.func,
    move: PropTypes.func,
    handleMouseEvent: PropTypes.func,
  }

  return TimeToPixels;
}
