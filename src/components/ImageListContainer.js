import React, { Component } from 'react';
import { connect } from 'react-redux';

import ImageList from './ImageList'
import { getImageList } from '../reducers/imageListReducer';
import { getResolution } from '../reducers/viewReducer';
import { saveImageToStorage } from '../actions/imageListActions';


class ImageListContainer extends Component {

  render() {

    return (
      <ImageList 
        saveImageToStorage ={this.props.saveImageToStorageAction}
        images={ this.props.images } 
        resolution={ this.props.resolution } 
      />);
  }
}

const mapStateToProps = (state, props) => {
  return {
    images: getImageList(state),
    resolution: getResolution(state),
  }
};

const mapDispatchToProps = dispatch => ({
  saveImageToStorageAction: (imageFile, key) => dispatch(saveImageToStorage(imageFile, key)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageListContainer);
