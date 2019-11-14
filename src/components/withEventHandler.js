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
        deleteSelectedEntities, selectImageChannel, setMessage,
        setOrReplaceMarker, deleteMarker,
      } = this.props;

      this.mousehandler = new MouseHandler({
        selectRange, deselectRange, selectInInterval,
        move, resize, setOrReplaceInsertMarker, insertNewPart,
        toggleEntitySelection, toggleMultiEntitySelection, toggleInitialEntitySelection,
        deleteSelectedEntities, selectImageChannel, setMessage,
        setOrReplaceMarker, deleteMarker
      });
    }

    render() {

      // remove functions from props
      const {
        selectRange, deselectRange, selectInInterval,
        move, resize, setOrReplaceInsertMarker, insertNewPart,
        toggleEntitySelection, toggleMultiEntitySelection, toggleInitialEntitySelection,
        deleteSelectedEntities, setMessage, setOrReplaceMarker, deleteMarker,
        ...passthruProps } = this.props;

      return (
        <WrappedComponent { ...passthruProps }
          handleMouseEvent={ (eventName, evInfo) =>
            this.mousehandler.handleMouseEvent(eventName, evInfo, this.props.resolution) }
        />);
    }
  }

  WithEventHandler.propTypes = {
    selectRange: PropTypes.func,
    deselectRange: PropTypes.func,
    selectInInterval: PropTypes.func,
    move: PropTypes.func,
    resize: PropTypes.func,
    setOrReplaceInsertMarker: PropTypes.func,
    insertNewPart: PropTypes.func,
    toggleEntitySelection: PropTypes.func,
    toggleMultiEntitySelection: PropTypes.func,
    toggleInitialEntitySelection: PropTypes.func,
    deleteSelectedEntities: PropTypes.func,
    selectImageChannel: PropTypes.func,
    resolution: PropTypes.number,
    setMessage: PropTypes.func,
    setOrReplaceMarker: PropTypes.func,
    deleteMarker: PropTypes.func,
  };

  WithEventHandler.displayName = `WithEventHandler(${getDisplayName(WrappedComponent)})`;
  return WithEventHandler;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}