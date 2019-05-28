import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Modal, Typography, Button } from "@material-ui/core";

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
  headingArea: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: "20px",
    marginBottom: "10px",
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


export class Message extends Component {

  handleClose = () => {
    return this.props.clearMessage();
  }


  render() {

    const { message, classes } = this.props;
    const messageHtml = (
      <Typography className={ classes.text }>
        { message }
      </Typography>
    );

    return (
      <Modal open={ Boolean(message) }
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          disableBackdropClick={ true }
          onClose={ this.handleClose }>
        <div className={ classes.paper }>
          <div  className={ classes.headingArea }>
          <Typography variant="h6"
              id="modal-title">
            Message
          </Typography>

          </div>
          <div className={ classes.textArea }>
            <div variant="body2"
                id="simple-modal-description">
              { messageHtml }
            </div>
          </div>
          <div className={ classes.buttonArea }>
            <Button 
                onClick={ this.handleClose }>OK</Button>
          </div>
        </div>
      </Modal>
      );
  }
}

Message = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  message: PropTypes.string,
  clearMessage: PropTypes.func.isRequired,
};

export default withStyles(styles, {
  withTheme: true
})(Message);
