import React, { Component } from 'react';
import { connect } from 'react-redux';

import ImageList from './ImageList'
import { getImageList } from '../reducers/imageListReducer';


class ImageListContainer extends Component {

  render() {

    return (
      <ImageList {...this.props} />);
  }
}

const mapStateToProps = (state, props) => {
  return {
    images: getImageList(state),
  }
};

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageListContainer);
