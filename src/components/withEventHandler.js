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
        addPartWithMarkers: this.props.addPartWithMarkers,
        selectPartOrImage: this.props.selectPartOrImage,
        deleteSelectedPartAndMarkers: this.props.deleteSelectedPartAndMarkers,
      });
    }

    render() {

      const {mode, select, move, updateMarker, setMarker, addPartWithMarkers, selectPartOrImage, deleteSelectedPartAndMarkers, ...passthruProps} = this.props;

      if (this.mousehandler) {
        this.mousehandler.setMode(this.props.mode);
      }

      return <WrappedComponent {...passthruProps} handleMouseEvent={ (eventName, evInfo) => this.mousehandler.handleMouseEvent(eventName, evInfo, this.props.resolution) } />
    }
  }

  WithEventHandler.propTypes = {
    select: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired,
    updateMarker: PropTypes.func.isRequired,
    setMarker: PropTypes.func.isRequired,
    addPartWithMarkers: PropTypes.func.isRequired,
    selectPartOrImage: PropTypes.func.isRequired,
    deleteSelectedPartAndMarkers: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['selectionMode', 'moveMode']).isRequired,
  }

  return WithEventHandler;

}