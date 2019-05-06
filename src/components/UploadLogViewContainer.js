import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getUploadLog } from "../reducers/viewReducer";
import UploadLogView from "./UploadLogView";
import { clearUploadLog } from "../actions/viewActions";
import { cancelUpload } from "../actions/generalActions";

class ImageControlContainer extends Component {

  render() {
    return ( <UploadLogView { ...this.props } /> );
  }
}

const mapStateToProps = (state, props) => {
  return {
    uploadLog: getUploadLog(state),
  };
};

const mapDispatchToProps = dispatch => ({
  clearUploadLog: () => dispatch(clearUploadLog()),
  cancelUpload: () => dispatch(cancelUpload()),
});

ImageControlContainer.propTypes = {
  uploadLog: PropTypes.string,
  clearUploadLog: PropTypes.func.isRequired,
  cancelUpload: PropTypes.func.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(ImageControlContainer);
