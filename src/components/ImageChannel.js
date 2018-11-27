import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';

const MAX_CANVAS_WIDTH = 1000;

const ImageProgress = styled.div`
  position: absolute;
  background: ${props => props.theme.waveProgressColor};
  width: ${props => props.progress}px;
  height: ${props => props.waveHeight}px;
`;

const ImageCursor = styled.div`
  position: absolute;
  background: ${props => props.theme.cursorColor};
  width: 1px;
  left: ${props => props.cursorPos}px;
  height: ${props => props.waveHeight}px;
`;

const ImageSelection = styled.div`
  position: absolute;
  left: ${props => props.selection.from}px;
  background: ${props => props.theme.selectionColor};
  width: ${props => props.selection.to - props.selection.from}px;
  height: ${props => props.waveHeight}px;
`;

const ImageCanvas = styled.canvas`
  float: left;
  position: relative;
  margin: 0;
  padding: 0;
  width: ${props => props.cssWidth}px;
  height: ${props => props.waveHeight}px;
`;

const CanvasImage = styled.img`
  display: none;
`;


// need position:relative so children will respect parent margin/padding
const ImageChannelWrapper = styled.div`
  position: relative; 
  margin: 0;
  padding: 0;
  background: ${props => props.theme.waveFillColor};
  width: ${props => props.cssWidth}px;
  height: ${props => props.waveHeight}px;
`;

class Channel extends Component {
  constructor(props) {
    super(props);
    this.canvases = [];
    this.images = [];
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  drawImage(ctx, img, sourceOffset, sourceWidth, targetWidth, targetHeight) {
    ctx.drawImage(img, sourceOffset, 0, sourceWidth, img.height, 0, 0, targetWidth, targetHeight);
    //ctx.drawImage(img, this.currentSourceCue, 0, this.sourceWidth, img.height,
    //     0, 0, this.targetWidth, canvas.height)
  }

  draw() {
    const { bits, /* length,*/ waveHeight, theme, scale } = this.props;


    let sourceOffset = 0;
    for (let i = 0; i < this.canvases.length; i++) {
      const canvas = this.canvases[i];
      const img = this.images[i];
      const cc = canvas.getContext('2d');
      const sourceWidth = img.width;
      const targetWidth = 300;

      cc.clearRect(0, 0, canvas.width, canvas.height);
      cc.fillStyle = theme.waveOutlineColor;
      cc.scale(scale, scale);

      img.onload = this.drawImage(cc, img, sourceOffset, sourceWidth, targetWidth, waveHeight)

      sourceOffset += MAX_CANVAS_WIDTH;
    }  
  }

  createCanvasRef(i) {
    return (canvas) => {this.canvases[i] = canvas}
  }

  createImageRef(i) {
    return (canvas) => {this.images[i] = canvas}
  }

  render() {
    const {
      source,
      length,
      waveHeight,
      scale,
      progress,
      cursorPos,
      selection,
      theme,
      handleMouseDown,
      handleMouseUp,
      handleMouseMove,
      handleMouseLeave,
    } = this.props;

    let totalWidth = length;
    let waveformCount = 0;
    const waveforms = [];
    while (totalWidth > 0) {
      const currentWidth = Math.min(totalWidth, MAX_CANVAS_WIDTH);
      const waveform = <div key= {`div-${waveformCount}`}>
      <ImageCanvas
        key={`${length}-${waveformCount}`}
        cssWidth={currentWidth}
        width={currentWidth * scale}
        height={waveHeight * scale}
        waveHeight={waveHeight} 
        ref={this.createCanvasRef(waveformCount)} />
        <CanvasImage 
          src={source} 
          className="hidden" 
          ref={this.createImageRef(waveformCount)}/>
      </div>

      waveforms.push(waveform);
      totalWidth -= currentWidth;
      waveformCount += 1;
    }

    return <ImageChannelWrapper 
      onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      cssWidth={length} theme={theme} waveHeight={waveHeight}>
      <ImageProgress progress={progress} theme={theme} waveHeight={waveHeight} />
      <ImageSelection selection={selection} theme={theme} waveHeight={waveHeight} />
      {waveforms}
      <ImageCursor cursorPos={cursorPos} theme={theme} waveHeight={waveHeight} /> 
    </ImageChannelWrapper>;
  }
}

Channel.defaultProps = {
  theme: {
    // color of the waveform outline
    waveOutlineColor: '#282c34',
    waveFillColor: '#05a0cd',
    waveProgressColor: 'rgb(255,120,0)',
    cursorColor: 'red',
    selectionColor: 'rgba(0,0,255,0.5)'
  },
  // checking `window.devicePixelRatio` when drawing to canvas.
  scale: 1,
  peaks: [],
  length: 0,
  bits: 0,
  // height in CSS pixels of each canvas element a waveform is on.
  waveHeight: 80,
  // width in CSS pixels of the progress on the channel.
  progress: 0,
  // position of the cursor in CSS pixels from the left of channel
  cursorPos: 0,
  selection: {from: 0, to:0}
};

export default withTheme(Channel);
