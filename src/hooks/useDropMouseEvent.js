import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { insertNewPart } from '../actions/channelActions';
import { setOrReplaceInsertMarker } from '../actions/markerActions';
import { setMessage } from '../actions/viewActions';

// handles all mouse events for the select action 

export function useDropMouseEvent() {


  const [prevPosX, setPrevPosX] = useState(null);
  const [prevTimestamp, setPrevTimestamp] = useState(0);
  const dispatch = useDispatch();

  // if TimeToPixels HOC wraps the Channel then pos is in secs
  function handleMouseEvent(eventName, evInfo) {
    //console.log(evInfo, eventName);
    switch (eventName) {

      case "dragEnter":
        handleInsertMarker(evInfo);
        break;

      case "dragOver":
        handleInsertMarker(evInfo);
        break;

      case "drop":
        handleInsertImage(evInfo);
        break;

      default:
        break;
    }
  }

  function handleInsertMarker(evInfo) {
    // only realize marker move after some time intervals and larger steps
    if (!prevPosX ||
      (evInfo.timestamp - prevTimestamp > 100 && Math.abs(evInfo.x - prevPosX) > 0.01)) {
      // console.log(evInfo.x, " ", evInfo.timestamp, "drag");
      dispatch(setOrReplaceInsertMarker(evInfo.x));
      setPrevPosX(evInfo.x);
      setPrevTimestamp(evInfo.timestamp);
    }
  }

  function handleInsertImage(evInfo) {
    // console.log(evInfo.x, " drop");
    // prevent drop of images that dont come from the ImageList
    if (evInfo.channelId && evInfo.imageId) {
      dispatch(insertNewPart({
        channelId: evInfo.channelId,
        imageId: evInfo.imageId,
        offset: evInfo.x
      }));
    } else {
      dispatch(setMessage("You cannot drop an image directly, drop it into the image view first.", "error", "Error"));
    }
    setPrevPosX(null);
    setPrevTimestamp(0);
  }

  // return the mouse event handling function to be used in the component
  return (eventName, evInfo) => handleMouseEvent(eventName, evInfo)
}