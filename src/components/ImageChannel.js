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
  left: ${props => props.cursorPos}px;
  height: ${props => props.height}px;
`;

const ImageSelection = styled.div`
  position: absolute;
  left: ${props => props.selection.from}px;
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
    this.canvasImageRefs = []; 
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw =() => {
    const {imageHeight, scale, factor} = this.props;

    let targetOffset = 0;

    for (let i = 0; i < this.canvases.length; i++) {
      const canvas = this.canvases[i];
      const canvasRef = this.canvasImageRefs[i];
      if (!canvas || !canvasRef) {
        break; // TODO: find out how to reset canvases on new render
      }

      const img = canvasRef.current;
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
      const pos = getMouseEventPosition(e, "ChannelWrapper");
      this.props.handleMouseEvent(pos, eventName);
      return;
    }
  }


  createCanvasRef(i) {
    return (canvas) => {
      this.canvases[i] = canvas
    }
  }

  render() {
    const {parts, imageHeight, scale, progress, cursorPos, selection, theme, maxWidth, factor} = this.props;

    // loop thru all images
    const allImageCanvases = [];
    const allCanvasRefImages = [];
    let imageCount = 0;
    this.canvases = [];
    this.canvasImageRefs = []; 

    if (parts && Array.isArray(parts)) {
      
      parts.forEach((part) => {

        const {id, src, offset, buffer} = {...part};

        // paint images of canvases with max with MAX_CANVAS_WIDTH
        const canvasImages = [];
        const length = buffer.width;
        let totalWidth = length * factor;

        while (totalWidth > 0) {
          const currentWidth = Math.min(totalWidth, MAX_CANVAS_WIDTH);
          const canvasImage = (
          <ImageCanvas 
            key={ `${id}-${imageCount}` } 
            cssWidth={ currentWidth } 
            width={ currentWidth * scale } 
            height={ imageHeight } 
            ref={ this.createCanvasRef(imageCount) } 
            data-partId= { id }
          />
          )

          canvasImages.push(canvasImage);
          totalWidth -= currentWidth;
          imageCount += 1;
        }
        const imgRef = React.createRef()
        this.canvasImageRefs.push(imgRef);
        allImageCanvases.push(
          
          <ImageCanvases 
            key= { id }
            className='ImageCanvases' 
            theme={ theme } 
            offset={ offset }
          >
            { canvasImages }

          </ImageCanvases>
        );
        allCanvasRefImages.push(
          <CanvasRefImage key={id} src={ src } className="hidden" ref={ imgRef } />
        ) 
      });
    }

    const progressElem = progress ?
      <ImageProgress className='Progress' progress={ progress } theme={ theme } height={ imageHeight } />
      : null;

    const selectionElem = selection && selection.from && selection.to ?
      <ImageSelection className='Selection' selection={ selection } theme={ theme } height={ imageHeight } />
      : null;

    const cursorElem = cursorPos ?
      <ImageCursor className='Cursor' cursorPos={ cursorPos } theme={ theme } height={ imageHeight }/>
      : null;

    return (
      <ImageChannelWrapper className='ChannelWrapper' 
        onMouseDown={ (e) => this.handleMouseEvent(e, "mouseDown") } 
        onMouseUp={ (e) => this.handleMouseEvent(e, "mouseUp") } 
        onMouseMove={ (e) => this.handleMouseEvent(e, "mouseMove") } 
        onMouseLeave={ (e) => this.handleMouseEvent(e, "mouseLeave") }
        cssWidth={ maxWidth } 
        theme={ theme } 
        height={ imageHeight }>

        { allCanvasRefImages }
        { allImageCanvases }
        { progressElem }
        { selectionElem }
        { cursorElem }

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
