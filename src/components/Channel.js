import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";
import { getMouseEventPosition, isImplementedKey, handleEvent } from "../utils/eventUtils";
import ChannelMarkersContainer from "./ChannelMarkersContainer";
import ImageChannel from "./ImageChannel";
import AudioChannel from "./AudioChannel";

// need position:relative so children will respect parent margin/padding
const ChannelWrapper = styled.div`
  position: relative; 
  margin: 0;
  padding: 0;
  background: ${props => props.backgroundColor};
  width: ${props => props.cssWidth}px;
  height: ${props => props.height}px;
  border: 1px solid ${props => props.theme.borderColor};
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
    handleEvent(e, eventName, this.props.handleMouseEvent, "ChannelWrapper", this.props.channelId);
  }

  render() {
    const { channelId, imageHeight, progress,
      theme, maxWidth, selected, type, offset,
      peaks, bits, parts, images } = this.props;


    const channelWrapperProps = {
      cssWidth: maxWidth + 2, // to give room for border
      theme,
      height: imageHeight + 2, // to give room for border
      tabIndex: 0,
      backgroundColor: selected ? theme.imageBackgroundColorSelected : theme.imageBackgroundColor,
    };

    // separate props
    const channelProps = type === "audio" ? {
      theme,
      maxWidth,
      offset,
      peaks,
      bits,
    } : {
        theme,
        maxWidth,
        selected,
        parts,
        images,
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
  maxWidth: PropTypes.number, // max width of all channels
  selected: PropTypes.bool,
  handleMouseEvent: PropTypes.func.isRequired,
  offset: PropTypes.number,
  peaks: PropTypes.object,
  bits: PropTypes.number,
  parts: PropTypes.arrayOf(PropTypes.object),
  images: PropTypes.object,
};

Channel.defaultProps = {
  maxWidth: 800, // initial width without audio
  imageHeight: 90, // multiple of num LEDs
};

export default withTheme(Channel);
