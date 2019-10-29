import React, { Component } from "react";
import { connect } from "react-redux";

import ChannelSelectorGroup from "./ChannelSelectorGroup";
import { updateChannel, setAChannelActive, unsetAChannelActive, deleteAChannel, duplicateChannel } from "../actions/channelActions";
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
  setChannelActive: (channelId) => dispatch(setAChannelActive(channelId)),
  unsetChannelActive: (channelId) => dispatch(unsetAChannelActive(channelId)),
  uploadImageChannelToPoi: (channelId) => dispatch(uploadImageChannelToPoi(channelId)),
  saveImageChannelAsBinary: (channelId) => dispatch(saveImageChannelAsBinary(channelId)),
  deleteChannel: (channelId) => dispatch(deleteAChannel(channelId)),
  duplicateChannel: (channelId) => dispatch(duplicateChannel(channelId)),
});

ChannelSelectorGroupContainer.propTypes = {
  /* no props being used here */
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelSelectorGroupContainer);
