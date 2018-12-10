import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { getMouseEventPosition } from '../utils/eventUtils';

const MAX_CANVAS_WIDTH = 1000;

const ImageProgress = styled.div`
  display: ${props => props.progress}
  position: absolute;
  background: ${props => props.theme.waveProgressColor};
  width: ${props => props.progress + props.offset}px;
  height: ${props => props.height}px;
  border-right: 1px solid ${props => props.theme.waveProgressBorderColor};
`;

const ImageCursor = styled.div`
  position: absolute;
  background: ${props => props.theme.cursorColor};
  width: 1px;
  left: ${props => props.offset + props.cursorPos}px;
  height: ${props => props.height}px;
`;

const ImageSelection = styled.div`
  position: absolute;
  left: ${props => props.offset + props.selection.from}px;
  background: ${props => props.theme.selectionColor};
  width: ${props => props.selection.to - props.selection.from}px;
  height: ${props => props.height}px;
`;

const ImageCanvas = styled.canvas`
  float: left;
  position: relative;
  margin: 0;
  padding: 0;
  width: ${props => props.cssWidth}px;
  height: ${props => props.height}px;
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
  height: ${props => props.height}px;
  
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
      img.onload = cc.drawImage(img, sourceOffset, 0, sourceWidth, img.height, 
        0, 0, targetWidth, imageHeight)

      targetOffset += MAX_CANVAS_WIDTH;
    }
  }

  handleMouseEvent = (e, eventName) => {
    if (this.props.handleMouseEvent) {
      const posX = getMouseEventPosition(e, "ChannelWrapper");
        this.props.handleMouseEvent(posX, eventName);
        return;
    }
  }


  createCanvasRef(i) {
    return (canvas) => {
      this.canvases[i] = canvas
    }
  }

  render() {
    const {id, images, imageHeight, scale, progress, cursorPos, 
      selection, theme, maxWidth, factor} = this.props;

    // loop thru all images
    const allImageCanvases = [];
    const allCanvasRefImages = [];  
    let imageCount = 0;
    let initialOffset = 0;

    if (images && Array.isArray(images)) {
      images.forEach((img) => {

        const {source, length, offset} = {...img};

        // paint images of canvases with max with MAX_CANVAS_WIDTH
        const canvasImages = [];  
        let totalWidth = length * factor;

        while (totalWidth > 0) {
          const currentWidth = Math.min(totalWidth, MAX_CANVAS_WIDTH);
          const canvasImage = (
          <ImageCanvas key={ `${id}-${source}-${imageCount}` } cssWidth={ currentWidth } width={ currentWidth * scale } height={ imageHeight } ref={ this.createCanvasRef(imageCount) }
          />
          )

          canvasImages.push(canvasImage);
          totalWidth -= currentWidth;
          imageCount += 1;
        }
        allImageCanvases.push(
          <ImageCanvases clasName='ImageCanvases' theme={ theme } offset={offset}>
          { canvasImages }
          </ImageCanvases>
        );
        allCanvasRefImages.push(
          <CanvasRefImage src={ source } className="hidden" ref={ this.canvasImage } />
        )
      });
      initialOffset = images[0] && images[0].offset ? images[0].offset : 0;
    }

    const progressElem = progress ? 
      <ImageProgress progress={ progress } theme={ theme } height={ imageHeight } offset={initialOffset}/> 
      : null;

    const selectionElem = selection && selection.from && selection.to ? 
    <ImageSelection selection={ selection } theme={ theme } height={ imageHeight } offset={initialOffset}/>
      : null;

    const cursorElem = cursorPos ? 
    <ImageCursor cursorPos={ cursorPos } theme={ theme } height={ imageHeight } offset={initialOffset}/>
      : null;

    return (
      <ImageChannelWrapper className='ChannelWrapper' 
        onMouseDown={ (e) => this.handleMouseEvent(e, "mouseDown") } 
        onMouseUp={ (e) => this.handleMouseEvent(e, "mouseUp") } 
        onMouseMove={ (e) => this.handleMouseEvent(e, "mouseMove") } 
        onMouseLeave={ (e) => this.handleMouseEvent(e, "mouseLeave") }
        cssWidth={ maxWidth } theme={ theme } height={ imageHeight }>
        {allCanvasRefImages}
        {allImageCanvases}
        {progressElem}
        {selectionElem}
        {cursorElem}
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
  maxWidth: 800,
  offset: 0,
  // height in CSS pixels of each canvas element an image is on.
  imageHeight: 90, // multiple of num LEDs
  // all x pixel values are from 0 regardless of offset
  // width in CSS pixels of the progress on the channel. (null: do not draw)
  progress: null,
  // position of the cursor in CSS pixels from the left of channel (null: do not draw)
  cursorPos: null,
  // position of the selection in CSS pixels from the left of channel (null: do not draw)
  selection: null,
};

export default withTheme(Channel);
