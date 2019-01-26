import React, { Component } from 'react';
import { connect } from 'react-redux';

import AnimationPane from './AnimationPane';
import { getCurrent } from '../reducers/viewReducer';
import { getSelectedChannels } from '../reducers/channelReducer';


class AnimationPaneContainer extends Component {

  render() {

    return (
      <AnimationPane 
       {...this.props}
      />
      );
  }
}

const mapStateToProps = state => ({
  current: getCurrent(state),
  selectedChannels: getSelectedChannels(state),
});

const mapDispatchToProps = dispatch => ({

})


export default connect(mapStateToProps, mapDispatchToProps)(AnimationPaneContainer);
