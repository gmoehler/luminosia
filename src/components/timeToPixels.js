/* 
  Deals with time (in secs) to pixel conversion
*/

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";

import { secondsToPixels, pixelsToSeconds } from "../utils/conversions";

// HOC to support time to pixel conversion for one channel
export function timeToPixels(WrappedComponent) {
  class TimeToPixels extends PureComponent {

    handleMouseEvent = (eventName, evInfo, resolution) => {
      if (this.props.handleMouseEvent) {
        evInfo.x = pixelsToSeconds(evInfo.x, resolution);
        evInfo.duration = pixelsToSeconds(evInfo.duration, resolution);
        this.props.handleMouseEvent(eventName, evInfo);
      }
    }

    render() {

      const { resolution, offset, progress, cursorPos, selection, maxDuration, parts, markers, handleMouseEvent, ...passthruProps } = this.props;

      // channel offset only used for audio buffer which does not contain parts
      const offsetPx = offset ? secondsToPixels(offset, resolution) : 0;
      const progressPx = progress ? secondsToPixels(progress, resolution) - offsetPx : 0;
      const selectionPx = selection ? {
        from: selection.from ? secondsToPixels(selection.from, resolution) - offsetPx : 0,
        to: selection.to ? secondsToPixels(selection.to, resolution) - offsetPx : 0,
        type: selection.type
      } : null;
      const cursorPosPx = selection && selection.from ? secondsToPixels(selection.from, resolution) - offsetPx : 0;
      const maxWidthPx = maxDuration ? secondsToPixels(maxDuration, resolution) : 0;
      const partsPx = parts ? cloneDeep(parts) : [];
      partsPx.forEach(part => {
        part.offset = part.offset ? secondsToPixels(part.offset, resolution) : 0;
        part.duration = part.duration ? secondsToPixels(part.duration, resolution) : 0;
        part.cuein = part.cuein ? secondsToPixels(part.cuein, resolution) : 0;
        part.cueout = part.cueout ? secondsToPixels(part.cueout, resolution) : 0;
      });
      const markersPx = markers ? cloneDeep(markers) : [];
      markersPx.forEach((marker) => {
        marker.pos = marker.pos ? secondsToPixels(marker.pos, resolution) - offsetPx : 0;
      });

      return (<WrappedComponent { ...passthruProps }
        offset={ offsetPx }
        progress={ progressPx }
        cursorPos={ cursorPosPx }
        selection={ selectionPx }
        maxWidth={ maxWidthPx }
        parts={ partsPx }
        markers={ markersPx }
        resolution={ resolution } // needed by TimeScale (?)
        handleMouseEvent={ (eventName, evInfo) => this.handleMouseEvent(eventName, evInfo, resolution) } />);
    }
  }
  ;

  TimeToPixels.propTypes = {
    resolution: PropTypes.number.isRequired,
    offset: PropTypes.number,
    progress: PropTypes.number,
    cursorPos: PropTypes.number,
    selection: PropTypes.object,
    maxDuration: PropTypes.number.isRequired,
    parts: PropTypes.array,
    markers: PropTypes.array,
    handleMouseEvent: PropTypes.func,
  };

  return TimeToPixels;
}
