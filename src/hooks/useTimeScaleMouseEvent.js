import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { deleteMarker, setOrReplaceMarker } from '../actions/markerActions';

// handles all mouse events for the move action for the parts in the timescale component
// gestures: drag to move

export function useTimeScaleMouseEvent() {

  const [markerId, setMarkerId] = useState(null);
  const dispatch = useDispatch();

  // TimeToPixels HOC wraps the Channel: pos is in secs
  function handleTimeScaleMouseEvent(eventName, evInfo) {
    switch (eventName) {

      case "mouseDown":
        // stop move of insert marker
        handleMoveEnd(evInfo);
        // start move of timeScale marker
        handleMoveStart(evInfo);
        break;

      case "mouseUp":
        // create marker or stop moving marker
        handleFinalizeMove(evInfo);
        handleMoveEnd(evInfo);
        break;

      case "mouseMove":
        handleMove(evInfo);
        break;

      case "mouseLeave":
        handleMoveEnd();
        break;

      default:
        break;
    }
  }

  function handleFinalizeMove(evInfo) {
    if (markerId) {
      // end move of this marker
      setMarkerId(null);
    } else {
      // create new timeScale marker
      const markerInfo = {
        //markerId will be generated
        pos: evInfo.x,
        type: "timeScale"
      };
      dispatch(setOrReplaceMarker(markerInfo));
    }
  }

  function handleMoveStart(evInfo) {
    // only move timeScale markers
    if (evInfo.markerId && evInfo.markerType === "timeScale") {
      setMarkerId(evInfo.markerId);
    }
  }

  function handleMove(evInfo) {
    const markerInfo = markerId ?
      {
        pos: evInfo.x,
        type: "timeScale",
        markerId: markerId
      } : {
        pos: evInfo.x,
        type: "insertTimeScale",
        markerId: "insertTimeScaleId" // just one of this type
      };
    dispatch(setOrReplaceMarker(markerInfo));
  }

  function handleMoveEnd() {
    if (!markerId) {
      dispatch(deleteMarker("insertTimeScaleId"));
    }
    setMarkerId(null);
  }

  // return the mouse event handling function to be used in the component
  return (eventName, evInfo) => handleTimeScaleMouseEvent(eventName, evInfo)
}