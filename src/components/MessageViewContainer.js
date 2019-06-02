import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { clearMessage } from "../actions/viewActions";
import { getMessage } from "../reducers/viewReducer";
import MessageView from "./MessageView";

class MessageViewContainer extends Component {

  render() {
    return ( <MessageView { ...this.props } /> );
  }
}

const mapStateToProps = (state, props) => {
  return {
    message: getMessage(state),
  };
};

const mapDispatchToProps = dispatch => ({
  clearMessage: () => dispatch(clearMessage()),
});

MessageViewContainer.propTypes = {
  message: PropTypes.object,
  clearMessage: PropTypes.func.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(MessageViewContainer);
