import React, { Component } from "react";
import { connect } from "react-redux";

import ChannelSelectorGroup from "./ChannelSelectorGroup";
import {
  updateChannel, setChannelActive, unsetChannelActive,
  deleteChannel, duplicateChannel
} from "../actions/channelActions";
import { uploadImageChannel, downloadImageChannel } from "../actions/generalActions";

import { getSelectedImageChannelId } from "../reducers/viewReducer";
import { getChannelSelectorData, getAllChannelIds } from "../reducers/achannelReducer";

class ChannelSelectorGroupContainer extends Component {

  render() {
    return (
      <ChannelSelectorGroup { ...this.props } />
    );
  };

}

const mapStateToProps = (state, props) => {
  return {
    channelIds: getAllChannelIds(state), //TODO: use subset only?
    selectedImageChannelId: getSelectedImageChannelId(state),
    getChannelSelectorData: (channelId) => getChannelSelectorData(state, channelId),
  };
};

const mapDispatchToProps = dispatch => ({
  updateChannel: (channelInfo) => dispatch(updateChannel(channelInfo)),
  setChannelActive: (channelId) => dispatch(setChannelActive(channelId)),
  unsetChannelActive: (channelId) => dispatch(unsetChannelActive(channelId)),
  uploadImageChannel: (channelId) => dispatch(uploadImageChannel(channelId)),
  downloadImageChannel: (channelId) => dispatch(downloadImageChannel(channelId)),
  deleteChannel: (channelId) => dispatch(deleteChannel(channelId)),
  duplicateChannel: (channelId) => dispatch(duplicateChannel(channelId)),
});

ChannelSelectorGroupContainer.propTypes = {
  /* no props being used here */
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelSelectorGroupContainer);
