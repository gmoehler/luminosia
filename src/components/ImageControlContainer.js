import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { loadImagesfromStorage, saveImagesToStorage, clearImagesfromStorage, clearImageList } from "../actions/imageListActions";
import ImageControl from "./ImageControl";

class ImageControlContainer extends Component {

  render() {

    const { loadImagesfromStorageAction, saveImagestoStorageAction, clearImageListAction, clearImagesfromStorageAction } = this.props;

    return (
      <ImageControl 
          loadImagesfromStorage={ loadImagesfromStorageAction }
          saveImagesToStorage={ saveImagestoStorageAction }
          clearImageList={ clearImageListAction }
          clearImagesfromStorage={ clearImagesfromStorageAction }
      />
      );
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  loadImagesfromStorageAction: () => dispatch(loadImagesfromStorage()),
  saveImagestoStorageAction: () => dispatch(saveImagesToStorage()),
  clearImagesfromStorageAction: () => dispatch(clearImagesfromStorage()),
  clearImageListAction: () => dispatch(clearImageList()),
});

ImageControlContainer.propTypes = {
  loadImagesfromStorageAction: PropTypes.func.isRequired,
  saveImagestoStorageAction:PropTypes.func.isRequired,
  clearImageListAction: PropTypes.func.isRequired,
  clearImagesfromStorageAction: PropTypes.func.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(ImageControlContainer);
