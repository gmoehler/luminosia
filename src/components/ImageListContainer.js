import React, { Component } from 'react';
import { connect } from 'react-redux';

import ImageList from './ImageList'
import { getImageList } from '../reducers/imageListReducer';
import { getResolution, getSelectedImage } from '../reducers/viewReducer';
import { saveImageToStorage, addImage } from '../actions/imageListActions';
import { selectPartOrImage } from '../actions/viewActions';

export const defaultSampleRate = 100;

class ImageListContainer extends Component {

  render() {

    return (
      <ImageList 
        addImage ={this.props.addImageAction}
        images={ this.props.images } 
        selectImage={this.props.selectPartOrImageAction}
        selectedImage={this.props.selectedImage}
        resolution={ this.props.resolution } 
        sampleRate={defaultSampleRate}
      />);
  }
}

const mapStateToProps = (state, props) => {
  return {
    images: getImageList(state),
    resolution: getResolution(state),
    selectedImage: getSelectedImage(state)
  }
};

const mapDispatchToProps = dispatch => ({
  addImageAction: (image) => dispatch(addImage(image)),
  selectPartOrImageAction: (imageInfo) => dispatch(selectPartOrImage(imageInfo)),
  saveImageToStorageAction: (imageFile, key) => dispatch(saveImageToStorage(imageFile, key)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageListContainer);
