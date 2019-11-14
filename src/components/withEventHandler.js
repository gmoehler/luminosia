/*
 HOC to support mouse and keyboard events
*/

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MouseHandler from "../handler/MouseHandler";
import { setOrReplaceMarker, deleteMarker, setOrReplaceInsertMarker } from "../actions/markerActions";
import { selectRange, deselectRange, selectImageChannel } from "../actions/viewActions";
import { selectInInterval, moveSelectedParts, resizePart } from "../actions/partActions";
import { insertNewPart } from "../actions/channelActions";
import { deleteSelectedEntities, toggleEntitySelection, toggleMultiEntitySelection, toggleInitialEntitySelection } from "../actions/entityActions";

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
            this.mousehandler.handleMouseEvent(eventName, evInfo) }
        />);
    }
  }

  // connect to directly to redux get the functions
  const mapStateToProps = (state, props) => {
    return {};
  };

  const mapDispatchToProps = (dispatch, props) => ({
    selectRange: (from, to, type) => dispatch(selectRange({
      from,
      to,
      type
    })),
    deselectRange: () => dispatch(deselectRange()),
    selectInInterval: (channelId, from, to) => dispatch(selectInInterval(channelId, from, to)),
    setOrReplaceInsertMarker: (pos) => dispatch(setOrReplaceInsertMarker(pos)),
    insertNewPart: (channelId, imageId, offset) => dispatch(insertNewPart({
      channelId,
      imageId,
      offset
    })),
    deleteSelectedEntities: () => dispatch(deleteSelectedEntities()),
    move: (partId, incr) => dispatch(moveSelectedParts({
      partId,
      incr
    })),
    resize: (partId, markerId, incr) => dispatch(resizePart({
      channelId: props.channelId,
      partId,
      markerId,
      incr
    })),

    setOrReplaceMarker: (markerInfo) => dispatch(setOrReplaceMarker(markerInfo)),
    deleteMarker: (markerId) => dispatch(deleteMarker(markerId)),
    selectImageChannel: (channelId) => dispatch(selectImageChannel(channelId)),
    toggleEntitySelection: (partId) => dispatch(toggleEntitySelection(partId)),
    toggleMultiEntitySelection: (partId) => dispatch(toggleMultiEntitySelection(partId)),
    toggleInitialEntitySelection: (partId) => dispatch(toggleInitialEntitySelection(partId)),
  });


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

  return connect(mapStateToProps, mapDispatchToProps)(WithEventHandler);;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}