/*
 HOC to support mouse and keyboard events
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MouseHandler from '../handler/MouseHandler';

export function withEventHandler(WrappedComponent) {

  class WithEventHandler extends PureComponent {
    constructor(props) {
      super(props);
      this.mousehandler = null;
    }

    componentDidMount() {
      // mouse handler setup
      this.mousehandler = new MouseHandler({
        select: this.props.select,
        move: this.props.move,
        updateMarker: this.props.updateMarker,
        setMarker: this.props.setMarker,
        insertNewPart: this.props.insertNewPart,
        selectPartOrImage: this.props.selectPartOrImage,
        deleteSelectedPartAndMarkers: this.props.deleteSelectedPartAndMarkers,
      });
    }

    render() {

      const {select, move, updateMarker, setMarker, insertNewPart, selectPartOrImage, deleteSelectedPartAndMarkers, ...passthruProps} = this.props;

      return <WrappedComponent {...passthruProps} handleMouseEvent={ (eventName, evInfo) => this.mousehandler.handleMouseEvent(eventName, evInfo, this.props.resolution) } />
    }
  }

  WithEventHandler.propTypes = {
    select: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired,
    updateMarker: PropTypes.func.isRequired,
    setMarker: PropTypes.func.isRequired,
    insertNewPart: PropTypes.func.isRequired,
    selectPartOrImage: PropTypes.func.isRequired,
    deleteSelectedPartAndMarkers: PropTypes.func.isRequired,
  }

  return WithEventHandler;

}