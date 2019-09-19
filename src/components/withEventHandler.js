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
        setMarker: this.props.setMarker,
        setOrReplaceInsertMarker: this.props.setOrReplaceInsertMarker,
        insertNewPart: this.props.insertNewPart,
        toggleAPartSelection: this.props.toggleAPartSelection,
        toggleMultiPartSelection: this.props.toggleMultiPartSelection,
        toggleInitialPartSelection: this.props.toggleInitialPartSelection,
        deleteSelectedPartAndMarkers: this.props.deleteSelectedPartAndMarkers,
        setMessage: this.props.setMessage,
      });
    }

    render() {

      const { selectRange, deselectRange, move, setMarker,
        insertNewPart, toggleAPartSelection,
        toggleMultiPartSelection, toggleInitialPartSelection,
        deleteSelectedPartAndMarkers,
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
    setMarker: PropTypes.func.isRequired,
    setOrReplaceInsertMarker: PropTypes.func.isRequired,
    insertNewPart: PropTypes.func.isRequired,
    toggleAPartSelection: PropTypes.func.isRequired,
    toggleMultiPartSelection: PropTypes.func.isRequired,
    toggleInitialPartSelection: PropTypes.func.isRequired,
    deleteSelectedPartAndMarkers: PropTypes.func.isRequired,
    resolution: PropTypes.number.isRequired,
    setMessage: PropTypes.func.isRequired,
  };

  return WithEventHandler;

}