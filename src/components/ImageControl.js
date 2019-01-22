import React, { Component } from 'react';
import styled /*, { withTheme } */ from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton, } from '@material-ui/core';

import RestoreImagesIcon from '@material-ui/icons/CloudDownload';
import SaveImagesIcon from '@material-ui/icons/CloudUpload';
import ClearStoreIcon from '@material-ui/icons/CloudOff';
import ClearImagesIcon from '@material-ui/icons/Clear';

const ChannelControlWrapper = styled.div`
  display: flex
  justify-content: center;
  flex-direction: row;
  margin: 0;
  padding: 0 20px;
`;

const styles = theme => ({
  root: {
    color: 'white',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 80,
  }
});


export class ImageControl extends Component {

  render() {

    return (
      <ChannelControlWrapper>
 
          <Tooltip title="Restore images from store">
            <IconButton color="primary" onClick={ this.props.loadImagesfromStorage }>
              <RestoreImagesIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Save images to store">
            <IconButton color="primary" onClick={ this.props.saveImagesToStorage }>
              <SaveImagesIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear store">
            <IconButton color="primary" onClick={ this.props.clearImagesfromStorage }>
              <ClearStoreIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear images">
            <IconButton color="primary" onClick={ this.props.clearImageList }>
              <ClearImagesIcon/>
            </IconButton>
          </Tooltip>

       </ChannelControlWrapper>
      );
  }
}

export default withStyles(styles, {
  withTheme: true
})(ImageControl);
