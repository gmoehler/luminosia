import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { clearMessage } from "../actions/viewActions";
import { getMessage } from "../reducers/viewReducer";
import Message from "./Message";

class MessageContainer extends Component {

  render() {
    return ( <Message { ...this.props } /> );
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

MessageContainer.propTypes = {
  message: PropTypes.string,
  clearMessage: PropTypes.func.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(MessageContainer);
