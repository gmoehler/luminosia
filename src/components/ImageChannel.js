import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';

const MAX_CANVAS_WIDTH = 1000;

const ImageProgress = styled.div`
  position: absolute;
  background: ${props => props.theme.waveProgressColor};
  width: ${props => props.progress + props.offset}px;
  height: ${props => props.imageHeight}px;
  border-right: 1px solid ${props => props.theme.waveProgressBorderColor};
`;

const ImageCursor = styled.div`
  position: absolute;
  background: ${props => props.theme.cursorColor};
  width: 1px;
  left: ${props => props.offset + props.cursorPos}px;
  height: ${props => props.imageHeight}px;
`;

const ImageSelection = styled.div`
  position: absolute;
  left: ${props => props.offset + props.selection.from}px;
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

const ImageCanvases = styled.div`
  float: left;
  position: relative;
  left: ${props => props.offset}px;
`;

// need position:relative so children will respect parent margin/padding
const ImageChannelWrapper = styled.div`
  position: relative; 
  margin: 0;
  padding: 0;
  background: ${props => props.theme.imageBackgroundColor};
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
    const {imageHeight, scale, factor} = this.props;

    let targetOffset = 0;
    for (let i = 0; i < this.canvases.length; i++) {
      const canvas = this.canvases[i];
      if (!canvas) {
        break; // TODO: find out how to reset canvases on new render
      }
      const img = this.canvasImage.current;
      const cc = canvas.getContext('2d');
      cc.clearRect(0, 0, canvas.width, canvas.height);
      const sourceOffset = targetOffset / factor;
      const targetWidth = MAX_CANVAS_WIDTH;
      const sourceWidth = targetWidth / factor;

      cc.scale(scale, scale);
      img.onload = cc.drawImage(img, sourceOffset, 0, sourceWidth, img.height, 0, 0, targetWidth, imageHeight)

      targetOffset += MAX_CANVAS_WIDTH;
    }
  }

  handleMouseEvent = (e, eventName) => {
    if (this.props.handleMouseEvent) {
      e.preventDefault();
      // find ChannelWrapper
      let el = e.target;
      while (el && el.classList && el.classList[0] !== 'ChannelWrapper') {
        el = el.parentNode;
      }
      if (el && el.classList && el.classList[0] === 'ChannelWrapper') {
        const x =  Math.max(0, e.clientX - el.offsetLeft);
        this.props.handleMouseEvent(x, eventName);
        return;
      }
      console.warn("MouseEvent did not find ChannelWrapper");
    }
  }

  createCanvasRef(i) {
    return (canvas) => {
      this.canvases[i] = canvas
    }
  }

  render() {
    const {source, length, imageHeight, scale, progress, cursorPos, selection, theme, offset, } = this.props;

    let totalWidth = length;
    let imageCount = 0;
    const canvasImages = [];
    while (totalWidth > 0) {
      const currentWidth = Math.min(totalWidth, MAX_CANVAS_WIDTH);
      const canvasImage = (
      <ImageCanvas key={ `${length}-${imageCount}` } cssWidth={ currentWidth } width={ currentWidth * scale } height={ imageHeight * scale } imageHeight={ imageHeight } ref={ this.createCanvasRef(imageCount) }
      />
      )

      canvasImages.push(canvasImage);
      totalWidth -= currentWidth;
      imageCount += 1;
    }

    return (
      <ImageChannelWrapper className='ChannelWrapper' 
        onMouseDown={ (e) => this.handleMouseEvent(e, "mouseDown") } 
        onMouseUp={ (e) => this.handleMouseEvent(e, "mouseUp") } 
        onMouseMove={ (e) => this.handleMouseEvent(e, "mouseMove") } 
        onMouseLeave={ (e) => this.handleMouseEvent(e, "mouseLeave") }
        cssWidth={ length } theme={ theme } imageHeight={ imageHeight }>
        <CanvasRefImage src={ source } className="hidden" ref={ this.canvasImage } />
        <ImageCanvases clasName='ImageCanvases' theme={ theme } offset={offset}>
          { canvasImages }
        </ImageCanvases>
        <ImageProgress progress={ progress } theme={ theme } imageHeight={ imageHeight } offset={offset}/>
        <ImageSelection selection={ selection } theme={ theme } imageHeight={ imageHeight } offset={offset}/>
        <ImageCursor cursorPos={ cursorPos } theme={ theme } imageHeight={ imageHeight } offset={offset}/>
      </ImageChannelWrapper>
      );
  }
}

Channel.defaultProps = {
  theme: {
    waveProgressColor: 'transparent', // 'rgb(255,255,255,0.3)', // transparent white
    waveProgressBorderColor: 'rgb(255,255,255,1)', // transparent white
    cursorColor: 'red',
    selectionColor: 'rgba(0,0,255,0.5)',
    imageBackgroundColor: 'black',
  },
  factor: 1,
  // checking `window.devicePixelRatio` when drawing to canvas.
  scale: 1,
  length: 0,
  offset: 0,
  // height in CSS pixels of each canvas element an image is on.
  imageHeight: 90, // multiple of num LEDs
  // width in CSS pixels of the progress on the channel.
  progress: 0,
  // position of the cursor in CSS pixels from the left of channel
  cursorPos: 0,
  // position of the selection in CSS pixels from the left of channel
  selection: {
    from: 0,
    to: 0
  }
};

export default withTheme(Channel);
