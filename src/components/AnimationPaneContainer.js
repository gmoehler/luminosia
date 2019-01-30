import React, { Component } from 'react';
import { connect } from 'react-redux';

import AnimationPane from './AnimationPane';
import { getCurrent, getSelectionRange } from '../reducers/viewReducer';
import { getSelectedChannelIds, allChannelsStopped, getMaxDuration } from '../reducers/channelReducer';
import { withPlay } from './withPlay'

const AnimationPaneWithPlay = withPlay(AnimationPane);

class AnimationPaneContainer extends Component {
  constructor(props) {
    super(props);
    this.playState = "stopped";
  }

  setChannelPlayState() {
    // empty for now
  }


  render() {

    return (
      <AnimationPaneWithPlay 
        sampleRate={ 100 } 
        resolution={ 2 } 
        type="animation" 
        setChannelPlayState={ this.setChannelPlayState } {...this.props}
      />
      );
  }
}

const mapStateToProps = state => ({
  playState: allChannelsStopped(state) ? "stopped" : "playing",
  current: getCurrent(state),
  selectedChannels: getSelectedChannelIds(state, "image"),
  selection: getSelectionRange(state),
  maxDuration: getMaxDuration(state),
});

const mapDispatchToProps = dispatch => ({

})


export default connect(mapStateToProps, mapDispatchToProps)(AnimationPaneContainer);
