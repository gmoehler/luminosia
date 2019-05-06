import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Modal, Typography, Button } from "@material-ui/core";
import { killCurrentProcess, doneMessage, doneWithErrorMessage, doneWithCancelledMessage } from "../utils/fileUtilsElectron";

const styles = theme => ({
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none",
    top: "20%",
    left: "20%",
    width: "60%",
    height: "70vh",
    display: "flex",
    flexDirection: "column"
  },
  textArea: {
    display: "flex",
    flexDirection: "column-reverse", // to autoscroll to end
    height: "100%",
    overflowX: "none",
    overflowY: "auto",
    border: "2px lightgrey solid",
    margin: "16px"
  },
  text: {
    fontSize: "13px",
    lineHeight: "normal",
    margin: "6px",
    wordBreak: "break-all",
  },
  buttonArea: {
    marginRight: "16px",
    alignSelf: "flex-end",
  }
});

function hashCode(s) {
  return s.split("").reduce(function(a, b) {
    a = ((a << 5) - a) + b.charCodeAt(0);return a & a;
  }, 0);
}
;

export class UploadLogView extends Component {

  handleClose = () => {
    return this.props.clearUploadLog();
  }

  handleCancel = () => {
    return this.props.cancelUpload();
  }


  render() {

    const { uploadLog, classes } = this.props;
    const logLines = uploadLog ? uploadLog.split("\n") : [];
    const logLinesHtml = logLines.map((line) => (
      <p className={ classes.text }
          id={ hashCode(classes.text) }>
        { line }
      </p>
    ));

    // hack because we do not have a async action with proper redux states for uploading yet
    const uploadFinished = uploadLog && (
      uploadLog.includes(doneMessage) || uploadLog.includes(doneWithErrorMessage)
      || uploadLog.includes(doneWithCancelledMessage));

    return (
      <Modal open={ Boolean(uploadLog) }
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          onClose={ this.handleClose }>
        <div className={ classes.paper }>
          <Typography variant="h6"
              id="modal-title">
            Uploading channel data
          </Typography>
          <div className={ classes.textArea }>
            <Typography variant="body2"
                id="simple-modal-description">
              { logLinesHtml }
            </Typography>
          </div>
          <div className={ classes.buttonArea }>
            <Button disabled={ uploadFinished }
                onClick={ this.handleCancel }>Cancel upload</Button>
            <Button disabled={ !uploadFinished }
                onClick={ this.handleClose }>Close</Button>
          </div>
        </div>
      </Modal>
      );
  }
}

UploadLogView.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  uploadLog: PropTypes.string,
  clearUploadLog: PropTypes.func.isRequired,
  cancelUpload: PropTypes.func.isRequired,
};

export default withStyles(styles, {
  withTheme: true
})(UploadLogView);
