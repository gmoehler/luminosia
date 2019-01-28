import React, { Component } from 'react';
import { connect } from 'react-redux';

import ChannelSelector from './ChannelSelector';
import { getAllChannelsOverview } from '../reducers/channelReducer';
import { selectChannel, deselectChannel } from '../actions/channelActions';

class ChannelSelectorContainer extends Component {

  render() {

    return (
      <ChannelSelector
        channelOverview={this.props.channelOverview}
        selectChannel={this.props.selectChannelAction}
        deselectChannel={this.props.deselectChannelAction}
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
})

export default connect(mapStateToProps, mapDispatchToProps)(ChannelSelectorContainer);
