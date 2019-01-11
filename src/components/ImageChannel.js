import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { getMouseEventPosition } from '../utils/eventUtils';

const MAX_CANVAS_WIDTH = 1000;

const ImageProgress = styled.div`
  position: absolute;
  background: ${props => props.theme.waveProgressColor};
  width: 1px;
  left: ${props => props.progress}px;
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

const ImageMarker = styled.div`
  position: absolute;
  background: ${props => props.markerColor || props.theme.markerColor};
  width: 1px;
  left: ${props => props.markerPos}px;
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
  position: absolute;
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
    this.images = [];
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw = () => {
    const {imageHeight, scale, factor} = this.props;

    Object.keys(this.images).forEach((idx) => {

      const img = this.images[idx];
      let canvasOffset = 0; // TODO: use cue
      if (!img) {
        return;
      }

      for (let c = 0; c < this.canvases[idx].length; c++) {
        const canvas = this.canvases[idx][c];
        if (!canvas) {
          break;
        }

        const cc = canvas.getContext('2d');
        cc.clearRect(0, 0, canvas.width, canvas.height);
        const imageOffset = canvasOffset / factor;

        const targetWidth = canvas.width;
        const sourceWidth = targetWidth / factor;

        const targetHeight = imageHeight;

        cc.scale(scale, scale);
        img.onload = cc.drawImage(img, imageOffset, 0, sourceWidth, img.height,
          0, 0, targetWidth, targetHeight)

        canvasOffset += MAX_CANVAS_WIDTH;
      }
    })
  }

  handleMouseEvent = (e, eventName) => {
    if (this.props.handleMouseEvent) {
      e.preventDefault();
      const pos = getMouseEventPosition(e, "ChannelWrapper", this.props.id);
      const src = e.dataTransfer && e.dataTransfer.getData("src");
      const duration = Number(e.dataTransfer && e.dataTransfer.getData("duration"));
      const evInfo = {
        ...pos, // x pos, channelId, partId
        timestamp: e.timeStamp,
        src, // drag source path
        duration,
      }
      this.props.handleMouseEvent(eventName, evInfo);
      return;
    }
  }


  createCanvasRef(i, c) {
    return (canvas) => {
      if (!this.canvases[i]) {
        this.canvases[i] = [];
      }
      this.canvases[i][c] = canvas
    }
  }

  createImageRef(i) {
    return (image) => {
      this.images[i] = image;
    }
  }

  render() {
    const {parts, imageHeight, scale, progress, cursorPos, selection, markers, theme, maxWidth} = this.props;

    // loop thru all images/parts
    const allImageCanvases = [];
    const allCanvasRefImages = [];
    this.canvases = [];
    this.images = [];

    if (parts && Array.isArray(parts)) {

      parts.forEach((part) => {

        const {id, src, offset, duration} = {
          ...part
        };

        // paint images of canvases with max with MAX_CANVAS_WIDTH
        const canvasImages = [];
        let totalWidth = duration;
        let canvasCount = 0;

        while (totalWidth > 0) {
          const currentWidth = Math.min(totalWidth, MAX_CANVAS_WIDTH);
          const canvasImage = (
          <ImageCanvas key={ String(id) + "-" + String(canvasCount) } cssWidth={ currentWidth } width={ currentWidth * scale } height={ imageHeight } ref={ this.createCanvasRef(id, canvasCount) } data-partid={ id }
          />
          )

          canvasImages.push(canvasImage);
          totalWidth -= currentWidth;
          canvasCount += 1;
        }
        allImageCanvases.push(
          <ImageCanvases key={ id } className='ImageCanvases' theme={ theme } offset={ offset }>
            { canvasImages }
          </ImageCanvases>
        );
        allCanvasRefImages.push(
          <CanvasRefImage key={ id } src={ src } className="hidden" ref={ this.createImageRef(id) } />
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
      <ImageCursor className='Cursor' cursorPos={ cursorPos } theme={ theme } height={ imageHeight } />
      : null;

    const markerElems = markers && Array.isArray(markers) ?
      markers.map((marker) => { 
        let color = theme.markerColor;
        if ( marker.type  === "insert" || marker.id  === "insert" ) {
          color = theme.insertMarkerColor;
        } else if ( marker.type  === "selected" ) {
          color = theme.selectedMarkerColor;
        }
        return <ImageMarker 
          key={ marker.id } 
          className='Marker' 
          markerPos={ marker.pos } 
          markerColor={color} 
          theme={ theme } 
          height={ imageHeight }
        />
      }
      ) : null;

    return (
      <ImageChannelWrapper className='ChannelWrapper' onMouseDown={ (e) => this.handleMouseEvent(e, "mouseDown") } onMouseUp={ (e) => this.handleMouseEvent(e, "mouseUp") } onMouseMove={ (e) => this.handleMouseEvent(e, "mouseMove") } onMouseLeave={ (e) => this.handleMouseEvent(e, "mouseLeave") }
        onDragEnter={ (e) => this.handleMouseEvent(e, "dragEnter") } 
        onDragEnd={ (e) => this.handleMouseEvent(e, "dragEnd") } 
        onDragExit={ (e) => this.handleMouseEvent(e, "dragExit") } 
        onDragLeave={ (e) => this.handleMouseEvent(e, "dragLeave") } 
        onDragOver={ (e) => this.handleMouseEvent(e, "dragOver") }
        onDragStart={ (e) => this.handleMouseEvent(e, "dragStart") } 
        onDrop={ (e) => this.handleMouseEvent(e, "drop") } 
        onClick={ (e) => this.handleMouseEvent(e, "click") } 
        onKeyDown={ (e) => this.handleMouseEvent(e, "keyDown") } 
        cssWidth={ maxWidth } theme={ theme } height={ imageHeight }>
        
        { allCanvasRefImages }
        { allImageCanvases }
        { progressElem }
        { selectionElem }
        { cursorElem }
        { markerElems }
      </ImageChannelWrapper>
      );
  }
}

Channel.defaultProps = {
  theme: {
    waveProgressColor: 'transparent', // 'rgb(255,255,255,0.3)', // transparent white
    waveProgressBorderColor: 'rgb(255,255,255,1)', // transparent white
    cursorColor: 'red',
    markerColor: 'rgba(255,255, 0, 0.5)', // transparent yellow
    insertMarkerColor: 'rgba(255,165, 0, 0.5)', // transparent orange
    selectedMarkerColor: 'rgba(255,165, 0, 1)', // orange
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
  // positions of the markers in CSS pixels from the left of channel (null: do not draw)
  markers: [],
};

export default withTheme(Channel);
