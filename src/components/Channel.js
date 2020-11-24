import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";
import ChannelMarkersContainer from "./ChannelMarkersContainer";
import ImageChannel from "./ImageChannel";
import AudioChannel from "./AudioChannel";
import { useMouseEvent } from "../hooks/useMouseEvent";

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

function Channel(props) {

  const { channelId, imageHeight, progress, theme,
    maxWidth, selected, type, offset, peaks,
    bits, parts, images, resolution } = props;

  const handleMouseEvent = useMouseEvent(channelId, "ChannelWrapper", resolution);

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
    ? <AudioChannel {...channelProps} />
    : <ImageChannel {...channelProps} />;

  return (
    <ChannelWrapper {...channelWrapperProps} className="ChannelWrapper"
      onMouseDown={(e) => handleMouseEvent("mouseDown", e)}
      onMouseUp={(e) => handleMouseEvent("mouseUp", e)}
      onMouseMove={(e) => handleMouseEvent("mouseMove", e)}
      onMouseLeave={(e) => handleMouseEvent("mouseLeave", e)}
      onDragEnter={(e) => handleMouseEvent("dragEnter", e)}
      onDragEnd={(e) => handleMouseEvent("dragEnd", e)}
      onDragExit={(e) => handleMouseEvent("dragExit", e)}
      onDragLeave={(e) => handleMouseEvent("dragLeave", e)}
      onDragOver={(e) => handleMouseEvent("dragOver", e)}
      onDragStart={(e) => handleMouseEvent("dragStart", e)}
      onDrop={(e) => handleMouseEvent("drop", e)}>
      { innerChannel}
      <ChannelMarkersContainer className="ChannelMarkersContainer"
        channelId={channelId}
        progress={progress} theme={theme} />
    </ChannelWrapper>
  );

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
  resolution: PropTypes.number,
};

Channel.defaultProps = {
  maxWidth: 800, // initial width without audio
  imageHeight: 90, // multiple of num LEDs
};

export default withTheme(Channel);
