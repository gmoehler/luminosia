import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Modal, Typography, Button } from "@material-ui/core";

const styles = theme => ({
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 60,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none",
    top: "20%",
    left: "20%",
  },
});

export class UploadLogView extends Component {

  handleClose = () => {
    return this.props.clearUploadLog();
  }

  render() {

    const { uploadLog, classes } = this.props;

    return (
      <Modal
          open = { uploadLog }
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          onClose={ this.handleClose }
    >
      <div 
          className={ classes.paper }>
        <Typography variant="h6"
            id="modal-title">
          Uploading show
        </Typography>
        <Typography variant="body2"
            id="simple-modal-description">
          {uploadLog}
        </Typography>
        <Button onClick={ this.handleClose }>Cancel</Button>
        <Button onClick={ this.handleClose }>Continue</Button>
      </div>
    </Modal>
      );
  }
}

UploadLogView.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  uploadLog: PropTypes.string,
  clearUploadLog: PropTypes.func.isRequired
};

export default withStyles(styles, {
  withTheme: true
})(UploadLogView);
