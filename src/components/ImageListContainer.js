import React, { Component } from 'react';
import { connect } from 'react-redux';

import ImageList from './ImageList'
import { getImageList } from '../reducers/imageListReducer';
import { getResolution } from '../reducers/viewReducer';


class ImageListContainer extends Component {

  render() {

    return (
      <ImageList images={ this.props.images } resolution={ this.props.resolution } />);
  }
}

const mapStateToProps = (state, props) => {
  return {
    images: getImageList(state),
    resolution: getResolution(state),
  }
};

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageListContainer);
