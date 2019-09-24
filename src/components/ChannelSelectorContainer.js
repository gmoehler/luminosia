import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ChannelSelector from "./ChannelSelector";
import { getAllChannelsOverview } from "../reducers/channelReducer";
import { updateChannel, setChannelActive, unsetChannelActive, deleteChannel, duplicateChannel } from "../actions/channelActions";
import { exportImageChannel } from "../actions/generalActions";
import { getSelectedImageChannelId } from "../reducers/viewReducer";

class ChannelSelectorContainer extends Component {

  render() {

    return (
      <ChannelSelector { ...this.props } />);
  }
}

const mapStateToProps = (state, props) => {
  return {
    channelOverview: getAllChannelsOverview(state),
    selectedImageChannelId: getSelectedImageChannelId(state),
  };
};

const mapDispatchToProps = dispatch => ({
  updateChannel: (channelInfo) => dispatch(updateChannel(channelInfo)),
  setChannelActive: (channelId) => dispatch(setChannelActive(channelId)),
  unsetChannelActive: (channelId) => dispatch(unsetChannelActive(channelId)),
  exportImageChannel: (channelId) => dispatch(exportImageChannel(channelId)),
  deleteChannel: (channelId) => dispatch(deleteChannel(channelId)),
  duplicateChannel: (channelId) => dispatch(duplicateChannel(channelId)),
});

ChannelSelectorContainer.propTypes = {
  channelOverview: PropTypes.array,
  selectedImageChannelId: PropTypes.number,
  setChannelActive: PropTypes.func.isRequired,
  unsetChannelActive: PropTypes.func.isRequired,
  exportImageChannel: PropTypes.func.isRequired,
  deleteChannel: PropTypes.func.isRequired,
  duplicateChannel: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelSelectorContainer);
