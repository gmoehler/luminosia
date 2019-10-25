import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ImageList from "./ImageList";
import { getImageList } from "../reducers/imageListReducer";
import { saveImageToStorage, addImage, loadImagesFromStorage } from "../actions/imageListActions";
import { setMessage } from "../actions/viewActions";
import { toggleEntitySelection, toggleMultiEntitySelection } from "../actions/entityActions";
import { isEntitySelected } from "../reducers/entityReducer";

export const defaultSampleRate = 100;

class ImageListContainer extends Component {

  render() {
    return (<ImageList
      { ...this.props }
      sampleRate={ defaultSampleRate }
      selectImage={ this.props.toggleEntitySelection }
      selectMultiImage={ this.props.toggleMultiEntitySelection }
    />);
  }
}

const mapStateToProps = (state, props) => {
  return {
    images: getImageList(state),
    isEntitySelected: (entityId) => isEntitySelected(state, entityId),
  };
};

const mapDispatchToProps = dispatch => ({
  addImage: (image) => dispatch(addImage(image)),
  setMessage: (text, type, title) => dispatch(setMessage({ text, type, title })),
  toggleEntitySelection: (imageId) => dispatch(toggleEntitySelection(imageId)),
  toggleMultiEntitySelection: (imageId) => dispatch(toggleMultiEntitySelection(imageId)),
  saveImageToStorage: (imageFile, key) => dispatch(saveImageToStorage(imageFile, key)),
  loadImagesFromStorage: () => dispatch(loadImagesFromStorage()),
});

ImageListContainer.propTypes = {
  images: PropTypes.array, // all images
  addImage: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  toggleEntitySelection: PropTypes.func.isRequired,
  toggleMultiEntitySelection: PropTypes.func.isRequired,
  loadImagesFromStorage: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageListContainer);
