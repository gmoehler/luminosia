import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';

const MAX_CANVAS_WIDTH = 1000;

const ImageProgress = styled.div`
  position: absolute;
  background: ${props => props.theme.waveProgressColor};
  width: ${props => props.progress}px;
  height: ${props => props.imageHeight}px;
  border-right: 1px solid ${props => props.theme.waveProgressBorderColor};
`;

const ImageCursor = styled.div`
  position: absolute;
  background: ${props => props.theme.cursorColor};
  width: 1px;
  left: ${props => props.cursorPos}px;
  height: ${props => props.imageHeight}px;
`;

const ImageSelection = styled.div`
  position: absolute;
  left: ${props => props.selection.from}px;
  background: ${props => props.theme.selectionColor};
  width: ${props => props.selection.to - props.selection.from}px;
  height: ${props => props.imageHeight}px;
`;

const ImageCanvas = styled.canvas`
  float: left;
  position: relative;
  margin: 0;
  padding: 0;
  width: ${props => props.cssWidth}px;
  height: ${props => props.imageHeight}px;
`;

const CanvasRefImage = styled.img`
  display: none;
`;

// need position:relative so children will respect parent margin/padding
const ImageChannelWrapper = styled.div`
  position: relative; 
  margin: 0;
  padding: 0;
  width: ${props => props.cssWidth}px;
  height: ${props => props.imageHeight}px;
`;

class Channel extends Component {
  constructor(props) {
    super(props);
    this.canvases = [];
    this.canvasImage = React.createRef();
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw() {
    const { imageHeight, scale, factor } = this.props;

    let targetOffset = 0;
    for (let i = 0; i < this.canvases.length; i++) {
      const canvas = this.canvases[i];
      const img = this.canvasImage.current;
      const cc = canvas.getContext('2d');
      const sourceOffset = targetOffset / factor;
      const targetWidth = MAX_CANVAS_WIDTH;
      const sourceWidth = targetWidth / factor;

      cc.scale(scale, scale);
      img.onload = cc.drawImage(img, sourceOffset, 0, sourceWidth, img.height, 0, 0, targetWidth, imageHeight)

      targetOffset += MAX_CANVAS_WIDTH;
    }  
  }

  createCanvasRef(i) {
    return (canvas) => {this.canvases[i] = canvas}
  }

  render() {
    const {
      source,
      length,
      imageHeight,
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
    let imageCount = 0;
    const canvasImages = [];
    while (totalWidth > 0) {
      const currentWidth = Math.min(totalWidth, MAX_CANVAS_WIDTH);
      const canvasImage = (
        <ImageCanvas
          key={`${length}-${imageCount}`}
          cssWidth={currentWidth}
          width={currentWidth * scale}
          height={imageHeight * scale}
          imageHeight={imageHeight} 
          ref={this.createCanvasRef(imageCount)} />
      )

      canvasImages.push(canvasImage);
      totalWidth -= currentWidth;
      imageCount += 1;
    }

    return (
      <ImageChannelWrapper 
        onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
        cssWidth={length} theme={theme} imageHeight={imageHeight}>
        <CanvasRefImage  src={source} className="hidden" ref={this.canvasImage}/> 
        {canvasImages}
        <ImageProgress progress={progress} theme={theme} imageHeight={imageHeight} />
        <ImageSelection selection={selection} theme={theme} imageHeight={imageHeight} />
        <ImageCursor cursorPos={cursorPos} theme={theme} imageHeight={imageHeight} />

      </ImageChannelWrapper>
    );
  }
}

Channel.defaultProps = {
  theme: {
    waveProgressColor: 'rgb(255,255,255,0.3)', // transparent white
    waveProgressBorderColor: 'rgb(255,255,255,1)', // transparent white
    cursorColor: 'red',
    selectionColor: 'rgba(0,0,255,0.5)'
  },
  factor: 1,
  // checking `window.devicePixelRatio` when drawing to canvas.
  scale: 1,
  length: 0,
  // height in CSS pixels of each canvas element an image is on.
  imageHeight: 80,
  // width in CSS pixels of the progress on the channel.
  progress: 0,
  // position of the cursor in CSS pixels from the left of channel
  cursorPos: 0,
  // position of the selection in CSS pixels from the left of channel
  selection: {from: 0, to:0}
};

export default withTheme(Channel);