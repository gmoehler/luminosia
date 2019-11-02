import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";
import { getMouseEventPosition, isImplementedKey } from "../utils/eventUtils";
import ChannelMarkersContainer from "./ChannelMarkersContainer";
import ImageChannel from "./ImageChannel";
import AudioChannel from "./AudioChannel";

// need position:relative so children will respect parent margin/padding
const ChannelWrapper = styled.div`
  position: relative; 
  margin: 0;
  padding: 0;
  background: ${props => props.theme.imageBackgroundColor};
  width: ${props => props.cssWidth}px;
  height: ${props => props.height}px;
  border: 1px solid ${props => props.borderColor};
  border-left: none;
`;

class Channel extends Component {

  componentDidMount() {
    document.addEventListener("keydown", (e) => {
      if (isImplementedKey(e)) return this.handleMouseEvent(e, "keyDown");
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", (e) => this.handleMouseEvent(e, "keyDown"));
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

  render() {
    const { channelId, imageHeight, progress,
      theme, maxWidth, selected, type, length, scale, factor, offset,
      peaks, bits, parts, images } = this.props;


    const channelWrapperProps = {
      cssWidth: type === "audio" ? 2 + length : maxWidth,
      theme,
      height: type === "audio" ? 2 + imageHeight : imageHeight,
      tabIndex: 0,
      borderColor: selected ? theme.borderColorSelected : theme.borderColor
    };

    // separate props
    const channelProps = type === "audio" ? {
      theme,
      scale,
      factor,
      offset,
      length,
      peaks,
      bits,
    } : {
        theme,
        scale,
        maxWidth,
        parts,
        images,
        selected,
        bits,
      };

    const innerChannel = type === "audio"
      ? <AudioChannel { ...channelProps } />
      : <ImageChannel { ...channelProps } />;

    return (
      <ChannelWrapper { ...channelWrapperProps }
        className="ChannelWrapper"
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
        onDrop={ (e) => this.handleMouseEvent(e, "drop") }>
        {innerChannel}
        <ChannelMarkersContainer
          className="ChannelMarkersContainer"
          channelId={ channelId }
          progress={ progress }
          theme={ theme } />
      </ChannelWrapper>
    );
  }
}

Channel.propTypes = {
  channelId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  imageHeight: PropTypes.number,
  progress: PropTypes.number,
  theme: PropTypes.object,
  maxWidth: PropTypes.number, // width for image
  length: PropTypes.number, // width for audio // TODO: make one width
  selected: PropTypes.bool,
  handleMouseEvent: PropTypes.func.isRequired,
  scale: PropTypes.number,
  factor: PropTypes.number,
  offset: PropTypes.number,
  peaks: PropTypes.object,
  bits: PropTypes.number,
  parts: PropTypes.arrayOf(PropTypes.object),
  images: PropTypes.object,
};

Channel.defaultProps = {
  maxWidth: 800,
  imageHeight: 90, // multiple of num LEDs
};

export default withTheme(Channel);
