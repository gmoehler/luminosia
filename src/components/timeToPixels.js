/* 
  Deals with time (in secs) to pixel conversion
*/

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";

import { secondsToPixels } from "../utils/conversions";

// HOC to support time to pixel conversion for one channel
export function timeToPixels(WrappedComponent) {
  class TimeToPixels extends PureComponent {

    render() {

      const { resolution, offset, maxDuration, parts, ...passthruProps } = this.props;

      // channel offset only used for audio buffer which does not contain parts
      const offsetPx = offset ? secondsToPixels(offset, resolution) : 0;
      const maxWidthPx = maxDuration ? secondsToPixels(maxDuration, resolution) : 0;
      const partsPx = parts ? cloneDeep(parts) : [];
      partsPx.forEach(part => {
        part.offset = part.offset ? secondsToPixels(part.offset, resolution) : 0;
        part.duration = part.duration ? secondsToPixels(part.duration, resolution) : 0;
      });

      const pixelProps = {
        ...passthruProps,
        offset: offsetPx,
        maxWidth: maxWidthPx,
        parts: partsPx,
        resolution: resolution,
      };

      return (<WrappedComponent {...pixelProps} />);
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
  };

  return TimeToPixels;
}
