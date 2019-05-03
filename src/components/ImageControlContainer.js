import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { loadImagesFromStorage, saveImagesToStorage, clearImagesfromStorage, clearImageList } from "../actions/imageListActions";
import ImageControl from "./ImageControl";

class ImageControlContainer extends Component {

  render() {
    return ( <ImageControl { ...this.props } /> );
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  loadImagesFromStorage: () => dispatch(loadImagesFromStorage()),
  saveImagesToStorage: () => dispatch(saveImagesToStorage()),
  clearImagesfromStorage: () => dispatch(clearImagesfromStorage()),
  clearImageList: () => dispatch(clearImageList()),
});

ImageControlContainer.propTypes = {
  loadImagesFromStorage: PropTypes.func.isRequired,
  saveImagesToStorage:PropTypes.func.isRequired,
  clearImageList: PropTypes.func.isRequired,
  clearImagesfromStorage: PropTypes.func.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(ImageControlContainer);
