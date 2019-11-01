import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";
import { getMouseEventPosition, isImplementedKey } from "../utils/eventUtils";
import ChannelMarkersContainer from "./ChannelMarkersContainer";

const MAX_CANVAS_WIDTH = 1000;

const ImageCanvas = styled.canvas`
  float: left;
  position: relative;
  margin: 0;
  padding: 0;
  width: ${props => props.cssWidth}px;
  height: ${props => props.height}px;
  border-left: ${props => props.channelSelected ? 2 : 1}px solid ${props => props.theme.markerColor};
  border-right:  ${props => props.channelSelected ? 2 : 1}px solid ${props => props.theme.markerColor};
`;

const CanvasRefImage = styled.img`
  display: none;
`;

const ImageCanvases = styled.div`
  float: left;
  position: absolute;
  left: ${props => props.offset}px;
  cursor: ${props => props.cursor};
`;

// need position:relative so children will respect parent margin/padding
const ImageChannelWrapper = styled.div`
  position: relative; 
  margin: 0;
  padding: 0;
  background: ${props => props.theme.imageBackgroundColor};
  width: ${props => props.cssWidth}px;
  height: ${props => props.height}px;
  border: 1px solid ${props => props.borderColor};
  border-left: none;
`;

class ImageChannel extends Component {
  constructor(props) {
    super(props);
    this.canvases = [];
    this.images = [];
  }

  componentDidMount() {
    this.draw();
    document.addEventListener("keydown", (e) => {
      if (isImplementedKey(e)) return this.handleMouseEvent(e, "keyDown");
    });
  }

  componentDidUpdate(prevProps) {
    this.draw();

    /*
    // print why this updates...
    const allKeys = Object.keys({ ...prevProps, ...this.props });
    // Use this object to keep track of changed props
    const changesObj = {};
    // Iterate through keys
    allKeys.forEach(key => {
      // If previous is different from current
      if (prevProps[key] !== this.props[key]) {
        // Add to changesObj
        changesObj[key] = {
          from: prevProps[key],
          to: this.props[key]
        };
      }
    });

    // If changesObj not empty then output to console
    if (Object.keys(changesObj).length) {
      console.log("[why-did-you-update]", changesObj);
    }
    */
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", (e) => this.handleMouseEvent(e, "keyDown"));
  }

  draw() {
    const { imageHeight, scale, factor } = this.props;

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

        const cc = canvas.getContext("2d");
        cc.clearRect(0, 0, canvas.width, canvas.height);

        const imageOffset = canvasOffset / factor;

        cc.scale(scale, scale);
        if (img.src) {
          img.onload = cc.drawImage(img, imageOffset, 0, img.width, img.height,
            0, 0, canvas.width, imageHeight);
        } else {
          cc.fillStyle = "#FF0000"; // red rectangle if image is missing
          cc.fillRect(0, 0, canvas.width, imageHeight);
        }
        canvasOffset += MAX_CANVAS_WIDTH;
      }
    });
  }

  handleMouseEvent(e, eventName) {
    if (this.props.handleMouseEvent) {
      e.preventDefault();
      const pos = eventName !== "keyDown" ?
        getMouseEventPosition(e, "ChannelWrapper", this.props.channelId) : {};
      // transfer data is not available until drop (not on dragEnter / dragOver)
      const imageId = e.dataTransfer && e.dataTransfer.getData("imageid");
      const duration = e.dataTransfer && Number(e.dataTransfer.getData("duration"));
      const key = e.key;
      const shiftKey = e.shiftKey;
      const ctrlKey = e.ctrlKey;

      let adaptedEventName = eventName;
      if (shiftKey) {
        adaptedEventName = "shift-" + adaptedEventName;
      }
      if (ctrlKey) {
        adaptedEventName = "crtl-" + adaptedEventName;
      }
      const evInfo = {
        ...pos, // x pos, channelId, partId, markerId
        timestamp: e.timeStamp,
        imageId,
        duration,
        key,
        shiftKey,
      };
      this.props.handleMouseEvent(adaptedEventName, evInfo);
      return;
    }
  }

  createCanvasRef(i, c) {
    return (canvas) => {
      if (!this.canvases[i]) {
        this.canvases[i] = [];
      }
      this.canvases[i][c] = canvas;
    };
  }

  createImageRef(i) {
    return (image) => {
      this.images[i] = image;
    };
  }

  render() {
    const { channelId, parts, imageHeight, scale, progress,
      theme, maxWidth, selected, imageSources } = this.props;

    // loop thru all images/parts
    const allImageCanvases = [];
    const allCanvasRefImages = [];
    this.canvases = [];
    this.images = [];

    if (parts && Array.isArray(parts)) {

      parts.forEach((part) => {

        const { partId, imageId, offset, duration } = {
          ...part
        };

        const src = imageSources[imageId];

        // paint images of canvases with max with MAX_CANVAS_WIDTH
        const canvasImages = [];
        let totalWidth = duration;
        let canvasCount = 0;

        while (totalWidth > 0) {
          const currentWidth = Math.min(totalWidth, MAX_CANVAS_WIDTH);
          const canvasImage = (
            <ImageCanvas key={ String(partId) + "-" + String(canvasCount) }
              cssWidth={ currentWidth }
              width={ currentWidth * scale }
              height={ imageHeight + 2 }
              ref={ this.createCanvasRef(partId, canvasCount) }
              data-partid={ partId }
              theme={ theme }
              channelSelected={ selected }
            />
          );

          canvasImages.push(canvasImage);
          totalWidth -= currentWidth;
          canvasCount += 1;
        }
        allImageCanvases.push(
          <ImageCanvases key={ partId }
            className="ImageCanvases"
            theme={ theme }
            offset={ offset }
            cursor={ "hand" }>
            {canvasImages}
          </ImageCanvases>
        );
        allCanvasRefImages.push(
          <CanvasRefImage
            key={ partId }
            src={ src }
            className="hidden"
            ref={ this.createImageRef(partId) } />
        );
      });
    }

    return (
      <ImageChannelWrapper className="ChannelWrapper"
        onMouseDown={ (e) => this.handleMouseEvent(e, "mouseDown") }
        onMouseUp={ (e) => this.handleMouseEvent(e, "mouseUp") }
        onMouseMove={ (e) => this.handleMouseEvent(e, "mouseMove") }
        onMouseLeave={ (e) => this.handleMouseEvent(e, "mouseLeave") }
        onDragEnter={ (e) => this.handleMouseEvent(e, "dragEnter") }
        onDragEnd={ (e) => this.handleMouseEvent(e, "dragEnd") }
        onDragExit={ (e) => this.handleMouseEvent(e, "dragExit") }
        onDragLeave={ (e) => this.handleMouseEvent(e, "dragLeave") }
        onDragOver={ (e) => this.handleMouseEvent(e, "dragOver") }
        onDragStart={ (e) => this.handleMouseEvent(e, "dragStart") }
        onDrop={ (e) => this.handleMouseEvent(e, "drop") }
        cssWidth={ maxWidth }
        theme={ theme }
        height={ 2 + imageHeight } // add border
        tabIndex={ 0 }
        borderColor={ selected ? theme.borderColorSelected : theme.borderColor }>
        {allCanvasRefImages}
        {allImageCanvases}
        <ChannelMarkersContainer
          channelId={ channelId }
          progress={ progress }
          theme={ theme } />
      </ImageChannelWrapper>
    );
  }
}

ImageChannel.propTypes = {
  channelId: PropTypes.string.isRequired,
  parts: PropTypes.arrayOf(
    PropTypes.shape({
      partId: PropTypes.string.isRequired,
      offset: PropTypes.number, // might be zero
      duration: PropTypes.number.isRequired,
    })),
  imageSources: PropTypes.object.isRequired,
  imageHeight: PropTypes.number,
  scale: PropTypes.number,
  progress: PropTypes.number,
  theme: PropTypes.object,
  maxWidth: PropTypes.number,
  selected: PropTypes.bool,
  handleMouseEvent: PropTypes.func.isRequired,
  factor: PropTypes.number,
};

ImageChannel.defaultProps = {
  factor: 1,
  // checking `window.devicePixelRatio` when drawing to canvas.
  scale: 1,
  maxWidth: 800,
  offset: 0,
  // height in CSS pixels of each canvas element an image is on.
  imageHeight: 90, // multiple of num LEDs
};

export default withTheme(ImageChannel);
