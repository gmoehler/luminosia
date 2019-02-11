import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ImageList from './ImageList';
import { getImageList } from '../reducers/imageListReducer';
import { getResolution, getSelectedImage } from '../reducers/viewReducer';
import { saveImageToStorage, addImage, loadImagesfromStorage } from '../actions/imageListActions';
import { selectPartOrImage } from '../actions/viewActions';

export const defaultSampleRate = 100;

class ImageListContainer extends Component {

  render() {

    const { addImageAction, images, selectPartOrImageAction, selectedImage, resolution, loadImagesfromStorageAction } = this.props;

    return (
      <ImageList 
          addImage ={ addImageAction }
          images={ images } 
          selectImage={ selectPartOrImageAction }
          selectedImage={ selectedImage }
          resolution={ resolution } 
          loadImagesfromStorage = { loadImagesfromStorageAction }
          sampleRate={ defaultSampleRate }
      />);
  }
}

const mapStateToProps = (state, props) => {
  return {
    images: getImageList(state),
    resolution: getResolution(state),
    selectedImage: getSelectedImage(state)
  };
};

const mapDispatchToProps = dispatch => ({
  addImageAction: (image) => dispatch(addImage(image)),
  selectPartOrImageAction: (imageInfo) => dispatch(selectPartOrImage(imageInfo)),
  saveImageToStorageAction: (imageFile, key) => dispatch(saveImageToStorage(imageFile, key)),
  loadImagesfromStorageAction: () => dispatch(loadImagesfromStorage()),
});

ImageListContainer.propTypes = {
  images: PropTypes.array, // all images
	resolution: PropTypes.number,
  addImageAction: PropTypes.func.isRequired,
  selectPartOrImageAction: PropTypes.func.isRequired,
  loadImagesfromStorageAction: PropTypes.func.isRequired,
	selectedImage: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageListContainer);
