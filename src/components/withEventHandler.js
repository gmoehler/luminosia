/*
 HOC to support mouse and keyboard events
*/

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import MouseHandler from "../handler/MouseHandler";

export function withEventHandler(WrappedComponent) {

  class WithEventHandler extends PureComponent {
    constructor(props) {
      super(props);
      this.mousehandler = null;
    }

    componentDidMount() {
      // add functions that the mouse handler can call
      this.mousehandler = new MouseHandler({
        selectRange: this.props.selectRange,
        deselectRange: this.props.deselectRange,
        selectInInterval: this.props.selectInInterval,
        move: this.props.move,
        resize: this.props.resize,
        setOrReplaceInsertMarker: this.props.setOrReplaceInsertMarker,
        insertNewPart: this.props.insertNewPart,
        toggleEntitySelection: this.props.toggleEntitySelection,
        toggleMultiEntitySelection: this.props.toggleMultiEntitySelection,
        toggleInitialEntitySelection: this.props.toggleInitialEntitySelection,
        deleteSelectedEntities: this.props.deleteSelectedEntities,
        setMessage: this.props.setMessage,
      });
    }

    render() {

      const {
        selectRange, deselectRange, move,
        insertNewPart, toggleEntitySelection,
        toggleMultiEntitySelection, toggleInitialEntitySelection,
        deleteSelectedEntities,
        ...passthruProps } = this.props;

      return (<WrappedComponent { ...passthruProps }
        handleMouseEvent={ (eventName, evInfo) =>
          this.mousehandler.handleMouseEvent(
            eventName, evInfo, this.props.resolution) } />);
    }
  }

  WithEventHandler.propTypes = {
    selectRange: PropTypes.func.isRequired,
    deselectRange: PropTypes.func.isRequired,
    selectInInterval: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired,
    resize: PropTypes.func.isRequired,
    setOrReplaceInsertMarker: PropTypes.func.isRequired,
    insertNewPart: PropTypes.func.isRequired,
    toggleEntitySelection: PropTypes.func.isRequired,
    toggleMultiEntitySelection: PropTypes.func.isRequired,
    toggleInitialEntitySelection: PropTypes.func.isRequired,
    deleteSelectedEntities: PropTypes.func.isRequired,
    resolution: PropTypes.number.isRequired,
    setMessage: PropTypes.func.isRequired,
  };

  return WithEventHandler;

}