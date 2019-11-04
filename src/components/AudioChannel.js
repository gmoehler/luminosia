import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";

const MAX_CANVAS_WIDTH = 1000;

const Waveform = styled.canvas`
  float: left;
  position: relative;
  margin: 0;
  padding: 0;
  width: ${props => props.cssWidth}px;
  height: ${props => props.waveHeight}px;
`;

const WaveformCanvases = styled.div`
  float: left;
  position: relative;
  left: ${props => props.offset}px;
  background: ${props => props.theme.waveFillColor};
`;

class Channel extends PureComponent {
  constructor(props) {
    super(props);
    this.canvases = [];
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps, prevState) {
    this.draw();
    /*
    Object.entries(this.props).forEach(([key, val]) =>
      prevProps[key] !== val && console.log(`AC Prop '${key}' changed`)
    );
    if (this.state) {
      Object.entries(this.state).forEach(([key, val]) =>
        prevState[key] !== val && console.log(`AC State '${key}' changed`)
      );
    }*/
  }

  draw() {
    const { peaks, bits, waveHeight, theme, scale } = this.props;

    let offset = 0;
    for (let i = 0; i < this.canvases.length; i++) {
      const canvas = this.canvases[i];
      if (!canvas) {
        break; // TODO: find out how to reset canvases on new render
      }
      const cc = canvas.getContext("2d");
      const h2 = waveHeight / 2;
      const maxValue = 2 ** (bits - 1);

      cc.clearRect(0, 0, canvas.width, canvas.height);
      cc.fillStyle = theme.waveOutlineColor;
      cc.scale(scale, scale);

      const peakSegmentLength = canvas.width / scale;
      for (let i = 0; i < peakSegmentLength; i += 1) {
        const minPeak = peaks[(i + offset) * 2] / maxValue;
        const maxPeak = peaks[((i + offset) * 2) + 1] / maxValue;

        const min = Math.abs(minPeak * h2);
        const max = Math.abs(maxPeak * h2);

        // draw max
        cc.fillRect(i, 0, 1, h2 - max);
        // draw min
        cc.fillRect(i, h2 + min, 1, h2 - min);
      }

      offset += MAX_CANVAS_WIDTH;
    }
  }

  createCanvasRef(i) {
    return (canvas) => {
      this.canvases[i] = canvas;
    };
  }

  render() {
    const { maxWidth, waveHeight, scale, theme, offset, } = this.props;

    let totalWidth = maxWidth;
    let waveformCount = 0;
    const waveforms = [];
    while (totalWidth > 0) {
      const currentWidth = Math.min(totalWidth, MAX_CANVAS_WIDTH);
      const waveform = (
        <Waveform key={ `${maxWidth}-${waveformCount}` }
          cssWidth={ currentWidth }
          width={ currentWidth * scale }
          height={ waveHeight * scale }
          waveHeight={ waveHeight }
          ref={ this.createCanvasRef(waveformCount) }
        />);

      waveforms.push(waveform);
      totalWidth -= currentWidth;
      waveformCount += 1;
    }

    return (<Fragment>
      <WaveformCanvases className="WaveformCanvases"
        theme={ theme }
        offset={ offset }>
        {waveforms}
      </WaveformCanvases>
    </Fragment>
    );
  }
}

Channel.propTypes = {
  theme: PropTypes.object,
  scale: PropTypes.number,
  maxWidth: PropTypes.number,

  offset: PropTypes.number,
  peaks: PropTypes.object,
  bits: PropTypes.number,
  waveHeight: PropTypes.number, // currently only default
};

Channel.defaultProps = {
  scale: 1, // currently always default, could use `window.devicePixelRatio`
  offset: 0,
  maxWidth: 0,

  peaks: [],
  bits: 0,
  // height in CSS pixels of each canvas element a waveform is on.
  waveHeight: 92,
};

export default withTheme(Channel);
