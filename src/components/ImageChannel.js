import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";
import { getMouseEventPosition, isImplementedKey } from "../utils/eventUtils";

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
  width: 2px;
  left: ${props => props.markerPos}px;
  height: ${props => props.height}px;
  cursor: ${props => props.cursor};
`;

const ImageSelection = styled.div`
  position: absolute;
  left: ${props => props.selection.from}px;
  background: ${props => props.selection.type === "temp" ? props.theme.tempSelectionColor :
    props.theme.selectionColor};
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

  componentDidUpdate() {
    this.draw();
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
    const { channelId, parts, imageHeight, scale, progress, cursorPos, selection, markers, theme, maxWidth, selected, imageSources } = this.props;

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

    const progressElem = progress ?
      (<ImageProgress className="Progress"
        progress={ progress }
        theme={ theme }
        height={ imageHeight } />)
      : null;

    const selectionElem = selection && selection.from && selection.to ?
      (<ImageSelection
        className="Selection"
        selection={ selection }
        theme={ theme }
        height={ imageHeight } />)
      : null;

    const cursorElem = cursorPos ?
      (<ImageCursor className="Cursor"
        cursorPos={ cursorPos }
        theme={ theme }
        height={ imageHeight } />)
      : null;

    const markerElems = markers && Array.isArray(markers) ?
      markers.map((marker) => {
        let color = theme.markerColor;
        let cursor = "default";
        // marker color depends on type (insert / normal), selection status
        //  and whether the part belongs to this channel
        if (marker.type === "insert" || marker.markerId === "insert") {
          color = theme.insertMarkerColor;
        } else if (marker.type === "selected" && marker.channelId === channelId) {
          color = theme.selectedMarkerColor;
          cursor = "col-resize";
        } else if (marker.type === "selected") {
          color = theme.selectedMarkerColorOther;
        } else if (marker.channelId !== channelId) {
          color = theme.markerColorOther;
        }
        return (<ImageMarker key={ marker.markerId }
          className="Marker"
          markerPos={ marker.pos }
          markerColor={ color }
          cursor={ cursor }
          theme={ theme }
          height={ imageHeight }
          data-markerid={ marker.markerId }
          data-partid={ marker.partId } />);
      }) : null;

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
        {progressElem}
        {selectionElem}
        {cursorElem}
        {markerElems}
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
  cursorPos: PropTypes.number,
  selection: PropTypes.exact({
    from: PropTypes.number,
    to: PropTypes.number,
    type: PropTypes.string
  }).isRequired,
  markers: PropTypes.arrayOf(PropTypes.object),
  theme: PropTypes.object,
  maxWidth: PropTypes.number,
  selected: PropTypes.bool,
  handleMouseEvent: PropTypes.func.isRequired,
  factor: PropTypes.number,
  gain: PropTypes.number,
};

ImageChannel.defaultProps = {
  theme: {
    waveProgressColor: "transparent", // 'rgb(255,255,255,0.3)', // transparent white
    waveProgressBorderColor: "rgb(255,255,255,1)", // transparent white
    cursorColor: "red",
    markerColor: "rgba(255,255, 0, 0.5)", // transparent yellow
    markerColorOther: "rgba(255,255, 0, 0.2)", // more transparent yellow
    insertMarkerColor: "rgba(255,165, 0, 0.5)", // transparent orange
    selectedMarkerColor: "rgba(255,165, 0, 1)", // orange
    selectedMarkerColorOther: "rgba(255,165, 0, 0.3)", // orange slightly transp
    selectionColor: "rgba(200,200,255,0.5)",
    tempSelectionColor: "rgba(80,80,80,0.5)",
    imageBackgroundColor: "black",
    borderColorSelected: "cornflowerblue",
    borderColor: "#3f51b5",
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
  // brightness gain of the window: 1 is fully bright, 0 is black
  gain: 1.0
};

export default withTheme(ImageChannel);
