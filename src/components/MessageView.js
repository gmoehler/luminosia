import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Modal, Typography, Button } from "@material-ui/core";

const styles = theme => ({
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    top: "20%",
    left: "20%",
    display: "flex",
    flexDirection: "column"
  },
  headingArea: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  textArea: {
    marginBottom: theme.spacing(2),
    height: "100%",
    overflow: "auto",
  },
  text: {
    fontSize: "14px",
    lineHeight: "normal",
    wordBreak: "break-all",
  },
  buttonArea: {
    alignSelf: "flex-end",
  }
});


export class MessageView extends Component {

  handleClose = () => {
    return this.props.clearMessage();
  }


  render() {

    const { message, classes } = this.props;

    const messageTitle = (message && message.title) ? 
      message.title : "Message";

    const messageHtml = (message && message.text) ? (
      <Typography className={ classes.text }>
        { message.text }
      </Typography>) : null;  

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
            { messageTitle }
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

MessageView.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  message: PropTypes.objectOf({
    text: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.string,
  }),
  clearMessage: PropTypes.func.isRequired,
};

export default withStyles(styles, {
  withTheme: true
})(MessageView);
