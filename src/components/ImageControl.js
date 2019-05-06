import React, { Component } from "react";
import PropTypes from "prop-types";
import styled /*, { withTheme } */ from "styled-components";
import { withStyles } from "@material-ui/core/styles";
import { Tooltip, IconButton, } from "@material-ui/core";

import RestoreImagesIcon from "@material-ui/icons/CloudDownload";
import SaveImagesIcon from "@material-ui/icons/CloudUpload";
import ClearStoreIcon from "@material-ui/icons/CloudOff";
import ClearImagesIcon from "@material-ui/icons/Clear";

const ImageControlWrapper = styled.div`
  display: flex
  justify-content: center;
  flex-direction: row;
  margin: 0;
  padding: 0 20px;
`;

const styles = theme => ({
  root: {
    color: "white",
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 80,
  }
});


export class ImageControl extends Component {

  render() {

    const { loadImagesFromStorage, saveImagesToStorage, clearImagesfromStorage, clearImageList } = this.props;

    return (
      <ImageControlWrapper>
        <Tooltip title="Restore images from store">
          <IconButton color="primary"
              onClick={ loadImagesFromStorage }>
            <RestoreImagesIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Save images to store">
          <IconButton color="primary"
              onClick={ saveImagesToStorage }>
            <SaveImagesIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Clear store">
          <IconButton color="primary"
              onClick={ clearImagesfromStorage }>
            <ClearStoreIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Clear images">
          <IconButton color="primary"
              onClick={ clearImageList }>
            <ClearImagesIcon />
          </IconButton>
        </Tooltip>
      </ImageControlWrapper>
      );
  }
}

ImageControl.propTypes = {
  loadImagesFromStorage: PropTypes.func.isRequired,
  saveImagesToStorage: PropTypes.func.isRequired,
  clearImagesfromStorage: PropTypes.func.isRequired,
  clearImageList: PropTypes.func.isRequired,

};

export default withStyles(styles, {
  withTheme: true
})(ImageControl);
