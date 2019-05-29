import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ImageList from "./ImageList";
import { getImageList } from "../reducers/imageListReducer";
import { getResolution, getSelectedImageIds } from "../reducers/viewReducer";
import { saveImageToStorage, addImage, loadImagesFromStorage } from "../actions/imageListActions";
import { toggleElementSelection, toggleElementMultiSelection, setMessage } from "../actions/viewActions";

export const defaultSampleRate = 100;

class ImageListContainer extends Component {

  render() {
    return ( <ImageList 
        { ...this.props }
        sampleRate={ defaultSampleRate }
        selectImage={ this.props.toggleElementSelection }
        selectMultiImage={ this.props.toggleElementMultiSelection }
    /> );
  }
}

const mapStateToProps = (state, props) => {
  return {
    images: getImageList(state),
    resolution: getResolution(state),
    selectedImageIds: getSelectedImageIds(state),
  };
};

const mapDispatchToProps = dispatch => ({
  addImage: (image) => dispatch(addImage(image)),
  setMessage: (text, type, title) => dispatch(setMessage({ text, type, title })),
  toggleElementSelection: (imageInfo) => dispatch(toggleElementSelection(imageInfo)),
  toggleElementMultiSelection: (imageInfo) => dispatch(toggleElementMultiSelection(imageInfo)),
  saveImageToStorage: (imageFile, key) => dispatch(saveImageToStorage(imageFile, key)),
  loadImagesFromStorage: () => dispatch(loadImagesFromStorage()),
});

ImageListContainer.propTypes = {
  images: PropTypes.array, // all images
  resolution: PropTypes.number,
  selectedImageIds: PropTypes.arrayOf(PropTypes.string),
  addImage: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  toggleElementSelection: PropTypes.func.isRequired,
  toggleElementMultiSelection: PropTypes.func.isRequired,
  loadImagesFromStorage: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageListContainer);
