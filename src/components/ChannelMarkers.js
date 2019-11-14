import React, { Fragment } from "react";
import PropTypes from "prop-types";

import styled, { withTheme } from "styled-components";


const ImageProgress = styled.div`
  position: absolute;
  background: ${props => props.theme.waveProgressColor};
  width: 1px;
  left: ${props => props.progress}px;
  height: 100%;
  border-right: 1px solid ${props => props.theme.waveProgressBorderColor};
`;

const ImageMarker = styled.div`
  position: absolute;
  background: ${props => props.color || props.theme.markerColor};
  width: 2px;
  left: ${props => props.markerPos}px;
  height: 100%;
  cursor: ${props => props.cursor};
`;

const ImageSelection = styled.div`
  position: absolute;
  left: ${props => props.selection.from}px;
  background: ${props => props.selection.type === "temp" ? props.theme.tempSelectionColor :
    props.theme.selectionColor};
  width: ${props => props.selection.to - props.selection.from}px;
  height: 100%;
`;


function ChannelMarkers(props) {

  const { channelId, progress, selection, markers, theme, } = props;

  const progressElem = progress ?
    (<ImageProgress className="Progress"
      progress={ progress }
      theme={ theme } />)
    : null;

  const selectionElem = selection && selection.from && selection.to ?
    (<ImageSelection
      className="Selection"
      selection={ selection }
      theme={ theme } />)
    : null;

  const markerElems = markers && Array.isArray(markers) ?
    markers.map((marker) => {
      let color = theme.markerColor;
      let cursor = "default";
      // marker color depends on type (insert / normal), selection status
      //  and whether the part belongs to this channel
      if (marker.type === "insert") {
        color = theme.insertMarkerColor;
      } else if (marker.type === "insertTimeScale") {
        color = theme.insertMarkerColor;
        cursor = "copy"; // with '+' sign
      } else if (marker.type === "timeScale") {
        cursor = "pointer";
      } else if (marker.type === "selected" && marker.channelId === channelId) {
        color = theme.selectedMarkerColor;
        cursor = "col-resize";
      } else if (marker.type === "selected") {
        color = theme.selectedMarkerColorOther;
      } else if (marker.channelId !== channelId) {
        color = theme.markerColorOther;
      }

      const markerProps = {
        key: marker.markerId,
        className: "Marker",
        markerPos: marker.pos,
        color,
        cursor,
        theme,
        "data-markerid": marker.markerId,
        "data-markertype": marker.type,
        "data-partid": marker.partId,
      };
      return (<ImageMarker { ...markerProps } />);

    }) : null;

  return (
    <Fragment>
      {progressElem}
      {selectionElem}
      {markerElems}
    </Fragment>
  );
}

ChannelMarkers.propTypes = {
  channelId: PropTypes.string,

  progress: PropTypes.number,
  cursorPos: PropTypes.number,
  selection: PropTypes.exact({
    from: PropTypes.number,
    to: PropTypes.number,
    type: PropTypes.string,
  }).isRequired,
  markers: PropTypes.arrayOf(PropTypes.exact({
    markerId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    pos: PropTypes.number.isRequired,
    channelId: PropTypes.string,
    partId: PropTypes.string,
  })).isRequired,

  theme: PropTypes.object,
};

ChannelMarkers.defaultProps = {
  // all x pixel values are from 0 regardless of offset
  // width in CSS pixels of the progress on the channel. (null: do not draw)
  progress: null,
  // position of the selection in CSS pixels from the left of channel (null: do not draw)
  selection: null,
  // positions of the markers in CSS pixels from the left of channel (null: do not draw)
  markers: [],
};

export default withTheme(ChannelMarkers);
