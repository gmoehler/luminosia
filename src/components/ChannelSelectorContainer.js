import React, { Component } from 'react';
import { connect } from 'react-redux';

import ChannelSelector from './ChannelSelector';
import { getAllChannelsOverview } from '../reducers/channelReducer';
import { selectChannel, deselectChannel, deleteChannel } from '../actions/channelActions';
import { exportImageChannel } from '../actions/generalActions';

class ChannelSelectorContainer extends Component {

  render() {

    return (
      <ChannelSelector
        channelOverview={this.props.channelOverview}
        selectChannel={this.props.selectChannelAction}
        deselectChannel={this.props.deselectChannelAction}
        exportImageChannel={this.props.exportImageChannelAction}
        deleteChannel={this.props.deleteChannelAction}
      />);
  }
}

const mapStateToProps = (state, props) => {
  return {
    channelOverview: getAllChannelsOverview(state),
  }
};

const mapDispatchToProps = dispatch => ({
  selectChannelAction: (channelId) => dispatch(selectChannel(channelId)),
  deselectChannelAction: (channelId) => dispatch(deselectChannel(channelId)),
  exportImageChannelAction: (channelId) => dispatch(exportImageChannel(channelId)),
  deleteChannelAction: (channelId) => dispatch(deleteChannel(channelId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChannelSelectorContainer);
