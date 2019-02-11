import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ChannelSelector from './ChannelSelector';
import { getAllChannelsOverview } from '../reducers/channelReducer';
import { selectChannel, deselectChannel, deleteChannel, duplicateChannel } from '../actions/channelActions';
import { exportImageChannel } from '../actions/generalActions';

class ChannelSelectorContainer extends Component {

  render() {

    const { channelOverview, selectChannelAction, deselectChannelAction,
      exportImageChannelAction, deleteChannelAction, duplicateChannelAction } = this.props;

    return (
      <ChannelSelector
          channelOverview={ channelOverview }
          selectChannel={ selectChannelAction }
          deselectChannel={ deselectChannelAction }
          exportImageChannel={ exportImageChannelAction }
          deleteChannel={ deleteChannelAction }
          duplicateChannel={ duplicateChannelAction }
      />);
  }
}

const mapStateToProps = (state, props) => {
  return {
    channelOverview: getAllChannelsOverview(state),
  };
};

const mapDispatchToProps = dispatch => ({
  selectChannelAction: (channelId) => dispatch(selectChannel(channelId)),
  deselectChannelAction: (channelId) => dispatch(deselectChannel(channelId)),
  exportImageChannelAction: (channelId) => dispatch(exportImageChannel(channelId)),
  deleteChannelAction: (channelId) => dispatch(deleteChannel(channelId)),
  duplicateChannelAction: (channelId) => dispatch(duplicateChannel(channelId)),
});

ChannelSelectorContainer.propTypes = {
  channelOverview: PropTypes.array,
  selectChannelAction: PropTypes.func.isRequired,
  deselectChannelAction: PropTypes.func.isRequired,
  exportImageChannelAction: PropTypes.func.isRequired,
  deleteChannelAction: PropTypes.func.isRequired,
  duplicateChannelAction: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelSelectorContainer);
