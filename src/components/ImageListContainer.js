import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ImageList from "./ImageList";
import { getImageList } from "../reducers/imageListReducer";
import { getResolution, getSelectedImageIds } from "../reducers/viewReducer";
import { saveImageToStorage, addImage, loadImagesfromStorage } from "../actions/imageListActions";
import { toggleElementSelection, toggleElementMultiSelection } from "../actions/viewActions";

export const defaultSampleRate = 100;

class ImageListContainer extends Component {

  render() {

    const { addImageAction, images, toggleElementSelectionAction, toggleElementMultiSelectionAction, 
      selectedImageIds, resolution, loadImagesfromStorageAction } = this.props;

    return (
      <ImageList 
          addImage ={ addImageAction }
          images={ images } 
          selectImage={ toggleElementSelectionAction }
          selectMultiImage={ toggleElementMultiSelectionAction }
          selectedImageIds={ selectedImageIds }
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
    selectedImageIds: getSelectedImageIds(state)
  };
};

const mapDispatchToProps = dispatch => ({
  addImageAction: (image) => dispatch(addImage(image)),
  toggleElementSelectionAction: (imageInfo) => dispatch(toggleElementSelection(imageInfo)),
  toggleElementMultiSelectionAction: (imageInfo) => dispatch(toggleElementMultiSelection(imageInfo)),
  saveImageToStorageAction: (imageFile, key) => dispatch(saveImageToStorage(imageFile, key)),
  loadImagesfromStorageAction: () => dispatch(loadImagesfromStorage()),
});

ImageListContainer.propTypes = {
  images: PropTypes.array, // all images
	resolution: PropTypes.number,
  addImageAction: PropTypes.func.isRequired,
  toggleElementSelectionAction: PropTypes.func.isRequired,
  toggleElementMultiSelectionAction: PropTypes.func.isRequired,
  loadImagesfromStorageAction: PropTypes.func.isRequired,
	selectedImageIds: PropTypes.arrayOf(PropTypes.string),
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageListContainer);
