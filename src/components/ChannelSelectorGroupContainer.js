import React, { Component } from "react";
import { connect } from "react-redux";

import ChannelSelectorGroup from "./ChannelSelectorGroup";
import { updateChannel, setChannelActive, setChannelInactive, deleteChannel, duplicateChannel } from "../actions/channelActions";
import { uploadImageChannelToPoi, saveImageChannelAsBinary } from "../actions/ioActions";

import { getChannelSelectorData, getAllChannelIds } from "../reducers/channelReducer";

class ChannelSelectorGroupContainer extends Component {

  render() {
    return (
      <ChannelSelectorGroup { ...this.props } />
    );
  };

}

const mapStateToProps = (state, props) => {
  return {
    channelIds: getAllChannelIds(state),
    getChannelSelectorData: (channelId) => getChannelSelectorData(state, channelId),
  };
};

const mapDispatchToProps = dispatch => ({
  updateChannel: (channelInfo) => dispatch(updateChannel(channelInfo)),
  setChannelActive: (channelId) => dispatch(setChannelActive(channelId)),
  setChannelInactive: (channelId) => dispatch(setChannelInactive(channelId)),
  uploadImageChannelToPoi: (channelId) => dispatch(uploadImageChannelToPoi(channelId)),
  saveImageChannelAsBinary: (channelId) => dispatch(saveImageChannelAsBinary(channelId)),
  deleteChannel: (channelId) => dispatch(deleteChannel(channelId)),
  duplicateChannel: (channelId) => dispatch(duplicateChannel(channelId)),
});

ChannelSelectorGroupContainer.propTypes = {
  /* no props being used here */
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelSelectorGroupContainer);
