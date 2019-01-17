import React, { Component } from 'react';
import { connect } from 'react-redux';

import ImageList from './ImageList'
import { getImageList } from '../reducers/imageListReducer';
import { getResolution } from '../reducers/viewReducer';
import { saveImageToStorage, addImage } from '../actions/imageListActions';

const defaultSampleRate = 100;

class ImageListContainer extends Component {

  render() {

    return (
      <ImageList 
        addImage ={this.props.addImageAction}
        images={ this.props.images } 
        resolution={ this.props.resolution } 
        sampleRate={defaultSampleRate}
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
  addImageAction: (image) => dispatch(addImage(image)),
  saveImageToStorageAction: (imageFile, key) => dispatch(saveImageToStorage(imageFile, key)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageListContainer);
