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
      const {
        selectRange, deselectRange, selectInInterval,
        move, resize, setOrReplaceInsertMarker, insertNewPart,
        toggleEntitySelection, toggleMultiEntitySelection, toggleInitialEntitySelection,
        deleteSelectedEntities, selectImageChannel, setMessage, setOrReplaceMarker
      } = this.props;

      this.mousehandler = new MouseHandler({
        selectRange, deselectRange, selectInInterval,
        move, resize, setOrReplaceInsertMarker, insertNewPart,
        toggleEntitySelection, toggleMultiEntitySelection, toggleInitialEntitySelection,
        deleteSelectedEntities, selectImageChannel, setMessage, setOrReplaceMarker
      });
    }

    render() {

      // remove functions from props
      const {
        selectRange, deselectRange, selectInInterval,
        move, resize, setOrReplaceInsertMarker, insertNewPart,
        toggleEntitySelection, toggleMultiEntitySelection, toggleInitialEntitySelection,
        deleteSelectedEntities, setMessage, setOrReplaceMarker,
        ...passthruProps } = this.props;

      return (
        <WrappedComponent { ...passthruProps }
          handleMouseEvent={ (eventName, evInfo) =>
            this.mousehandler.handleMouseEvent(eventName, evInfo, this.props.resolution) }
        />);
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
    selectImageChannel: PropTypes.func.isRequired,
    resolution: PropTypes.number.isRequired,
    setMessage: PropTypes.func.isRequired,
    setOrReplaceMarker: PropTypes.func.isRequired,
  };

  WithEventHandler.displayName = `WithEventHandler(${getDisplayName(WrappedComponent)})`;
  return WithEventHandler;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}