/*
 HOC to support mouse and keyboard events
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MouseHandler from '../handler/MouseHandler';
import { withPlay } from './withPlay';

export function withEventHandler(WrappedComponent) {


  class WithEventHandler extends PureComponent {

    // const WrappedComponentWithPlay = withPlay(WrappedComponent);

    componentDidMount() {
      // mouse handler setup
      this.mousehandler = new MouseHandler({
        select: this.props.select,
        move: this.props.move,
        updateMarker: this.props.updateMarker,
        setMarker: this.props.setMarker,
        addPartAndMarkers: this.props.addPartAndMarkers,
        selectPartOrImage: this.props.selectPartOrImage,
        deleteSelectedPartAndMarkers: this.props.deleteSelectedPartAndMarkers,
      });
    }

    render() {

      // const {
        // mode, 
        // select, move, updateMarker, setMarker, 
        // addPartAndMarkers, selectPartOrImage, 
        // deleteSelectedPartAndMarkers,
        //...passthruProps} = this.props;
        
        if (this.mousehandler) {
        this.mousehandler.setMode(this.props.mode);
      }


      return <WrappedComponent
        {...this.props} 
        handleMouseEvent={ (eventName, evInfo) => 
          this.mousehandler.handleMouseEvent(eventName, evInfo, this.props.resolution) } 
        />
    }
  }

  WithEventHandler.propTypes = {
    select: PropTypes.func.isRequired,
    move: PropTypes.func.isRequired,
    updateMarker: PropTypes.func.isRequired,
    setMarker: PropTypes.func.isRequired,
    addPartAndMarkers: PropTypes.func.isRequired,
    selectPartOrImage: PropTypes.func.isRequired,
    deleteSelectedPartAndMarkers: PropTypes.func.isRequired,
  }

}