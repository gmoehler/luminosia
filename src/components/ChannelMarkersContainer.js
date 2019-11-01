import React, { Component } from "react";
import { connect } from "react-redux";
import { cloneDeep } from "lodash";

import ChannelMarkers from "./ChannelMarkers";
import { getAllMarkers } from "../reducers/markerReducer";
import { getSelectionRange, getResolution, getSelectedImageChannelId } from "../reducers/viewReducer";
import { secondsToPixels } from "../utils/conversions";


class ChannelMarkersContainer extends Component {

  static getDerivedStateFromError(error) {
    return {
      error
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  componentDidCatch(error, state) {
    this.setState({
      error
    });
  }

  render() {

    if (this.state.error) {
      return (
        <div>
          <p> ERROR! Cannot continue. </p>
          {this.state.error.message ? <p>
            {this.state.error.message} </p> : null}
          {this.state.error.stack ? <p>
            {this.state.error.stack} </p> : null}
        </div>
      );
    }

    return (
      <ChannelMarkers { ...this.props } />
    );
  }
}

const mapStateToProps = (state, props) => {

  const { channelId, progress } = props;

  const resolution = getResolution(state);
  const selectedChannelId = getSelectedImageChannelId(state);

  // time to pixels
  const offsetPx = 0;

  //TODO: get progress directly (not thru channel)
  const progressPx = progress ? secondsToPixels(progress, resolution) - offsetPx : 0;
  const selection = getSelectionRange(state);
  const selectionPx = selection ? {
    from: selection.from ? secondsToPixels(selection.from, resolution) - offsetPx : 0,
    to: selection.to ? secondsToPixels(selection.to, resolution) - offsetPx : 0,
    type: selection.type
  } : null;

  const markers = getAllMarkers(state);
  const markersPx = cloneDeep(markers);
  markersPx.forEach((marker) => {
    marker.pos = marker.pos ? secondsToPixels(marker.pos, resolution) - offsetPx : 0;
  });

  return {
    channelId,
    progress: progressPx,
    markers: markersPx,
    selection: selectionPx,
    selected: channelId === selectedChannelId,
  };
};

const mapDispatchToProps = dispatch => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(ChannelMarkersContainer);
