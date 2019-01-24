import React, { Component } from 'react';
import { connect } from 'react-redux';

import AnimationPane from './AnimationPane';
import { getCurrentFrame } from '../reducers/viewReducer';

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
  currentFrame: getCurrentFrame(state),
});

const mapDispatchToProps = dispatch => ({

})


export default connect(mapStateToProps, mapDispatchToProps)(AnimationPaneContainer);
