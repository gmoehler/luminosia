import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ChannelSelector from "./ChannelSelector";
import { getAllChannelsOverview } from "../reducers/channelReducer";
import { setChannelActive, unsetChannelActive, deleteChannel, duplicateChannel } from "../actions/channelActions";
import { exportImageChannel } from "../actions/generalActions";
import { getSelectedImageChannelId } from "../reducers/viewReducer";

class ChannelSelectorContainer extends Component {

  render() {

    const { channelOverview, selectedImageChannelId, setChannelActiveAction, unsetChannelActiveAction,
      exportImageChannelAction, deleteChannelAction, duplicateChannelAction } = this.props;

    return (
      <ChannelSelector
          channelOverview={ channelOverview }
          selectedImageChannelId={ selectedImageChannelId }
          setChannelActive={ setChannelActiveAction }
          unsetChannelActive={ unsetChannelActiveAction }
          exportImageChannel={ exportImageChannelAction }
          deleteChannel={ deleteChannelAction }
          duplicateChannel={ duplicateChannelAction }
      />);
  }
}

const mapStateToProps = (state, props) => {
  return {
    channelOverview: getAllChannelsOverview(state),
    selectedImageChannelId: getSelectedImageChannelId(state),
  };
};

const mapDispatchToProps = dispatch => ({
  setChannelActiveAction: (channelId) => dispatch(setChannelActive(channelId)),
  unsetChannelActiveAction: (channelId) => dispatch(unsetChannelActive(channelId)),
  exportImageChannelAction: (channelId) => dispatch(exportImageChannel(channelId)),
  deleteChannelAction: (channelId) => dispatch(deleteChannel(channelId)),
  duplicateChannelAction: (channelId) => dispatch(duplicateChannel(channelId)),
});

ChannelSelectorContainer.propTypes = {
  channelOverview: PropTypes.array,
  selectedImageChannelId: PropTypes.number,
  setChannelActiveAction: PropTypes.func.isRequired,
  unsetChannelActiveAction: PropTypes.func.isRequired,
  exportImageChannelAction: PropTypes.func.isRequired,
  deleteChannelAction: PropTypes.func.isRequired,
  duplicateChannelAction: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelSelectorContainer);
