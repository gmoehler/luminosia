
import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { deleteSelectedEntities, toggleEntitySelection, toggleInitialEntitySelection, toggleMultiEntitySelection } from '../actions/entityActions';
import { moveSelectedParts, resizePart, selectInInterval } from '../actions/partActions';
import { deselectRange, selectImageChannel, selectRange } from '../actions/viewActions';

// handles all mouse events for the move action for the parts in the channel
// gestures: click to select, drag to move

export function useChannelMouseEvent(channelId) {

  const [fromX, setFromX] = useState(null);
  //const [channelId, setChannelId] = useState(null);
  const [partId, setPartId] = useState(null);
  const [markerId, setMarkerId] = useState(null);
  const [keyAtMouseDown, setKeyAtMouseDown] = useState(null);
  // possible actions: anyMouseAction, moveResize, selectPartInRange, selectRange
  const [currAction, setCurrAction] = useState(null);
  const dispatch = useDispatch();


  // central mouse & key event dispatcher
  // TimeToPixels HOC wraps the Channel: x pos is in secs
  function handleChannelMouseEvent(eventName, evInfo) {
    // console.log(eventName, currAction);
    const key = getKey(eventName);

    if (eventName === "keyDown") {
      handleKeyDown(evInfo);
    }
    else if (eventName.includes("mouseDown")) {
      handleActionStart(evInfo, key);
    }
    else if (eventName.includes("mouseMove")) {
      if (currAction) {
        handleMoveTo(evInfo, false);
      }
    }
    else if (eventName.includes("mouseUp")) {
      if (currAction === "anyMouseAction") {
        // just a simple click (no move)
        if (eventName === "ctrl-mouseUp") {
          handleMultiSelect(evInfo);
        } else {
          handleToggleSelection(evInfo);
        }
        resetAction();
      } else if (currAction) {
        handleMoveTo(evInfo, true);
      }
    }
    else if (eventName.includes("mouseLeave")) {
      if (currAction) {
        handleMoveTo(evInfo, true);
      }
    }
  }

  function getKey(eventName) {
    const keys = eventName.split("-");
    keys.pop();
    return keys.length ? keys.join("-") : null;
  }

  function resetAction() {
    if (currAction !== "selectRange") {
      dispatch(deselectRange());
    }
    setFromX(null);
    // setChannelId(null);
    setPartId(null);
    setMarkerId(null);
    setKeyAtMouseDown(null);
    setCurrAction(null);
  }

  function handleKeyDown(evInfo) {
    if (evInfo.key === "Delete" || evInfo.key === "Backspace") {
      dispatch(deleteSelectedEntities());
    }
  }

  // init for any mouse action
  function handleActionStart(evInfo, key) {
    if (evInfo.channelId) {
      setFromX(evInfo.x);
      // setChannelId(evInfo.channelId);
      setPartId(evInfo.partId);
      setMarkerId(evInfo.markerId); // for resize
      setKeyAtMouseDown(key);
      setCurrAction("anyMouseAction");
      dispatch(deselectRange()); // reset from earlier actions

      // start with selection (if clicked on part)...
      if (evInfo.partId && !key) {
        // select exclusively if not selected, do nothing when selected
        dispatch(toggleInitialEntitySelection(evInfo.partId));
      } // ... or zero range to give initial feedback
      else if (!evInfo.partId) {
        dispatch(selectRange({ from: evInfo.x, to: evInfo.x, type: "temp" }));
      }
    }
  }

  function handleMoveTo(evInfo, finalizeAction) {
    const incrX = evInfo.x - fromX;
    if (Math.abs(incrX) > 0) {

      // only move selected when we select a part
      if (["anyMouseAction", "moveResize"].includes(currAction)
        && !keyAtMouseDown
        && fromX && partId && channelId) {
        // console.log(`move from ${moveFromX} to ${x}`);
        moveResizePart(incrX);
        setFromX(evInfo.x);
      }

      else if (["anyMouseAction", "selectRange"].includes(currAction)
        && keyAtMouseDown === "shift"
        && fromX && channelId) {
        handleSelectRange(evInfo.x);
      }

      else if (["anyMouseAction", "selectPartInRange"].includes(currAction)
        && fromX && channelId) {
        selectPartInRange(evInfo.x);
      }
    }

    if (finalizeAction) {
      resetAction();
    }
  }

  function moveResizePart(incrX) {
    if (currAction === "anyMouseAction") { //first time call
      setCurrAction("moveResize");
    }

    if (markerId) {
      dispatch(resizePart({ channelId, partId, markerId, incr: incrX }));
    } else {
      dispatch(moveSelectedParts({ partId, incr: incrX }));
    }
  }

  function selectPartInRange(posX) {
    if (currAction === "anyMouseAction") { //first time call
      setCurrAction("selectPartInRange");
    }
    // console.log('selection to: ', posX);
    const leftX = Math.min(fromX, posX);
    const rightX = Math.max(fromX, posX);

    dispatch(selectRange({ from: leftX, to: rightX, type: "temp" }));
    dispatch(selectInInterval(channelId, leftX, rightX));
  }

  function handleSelectRange(posX) {
    if (currAction === "anyMouseAction") { //first time call
      setCurrAction("selectRange");
    }
    // console.log('selection to: ', posX);
    const leftX = Math.min(fromX, posX);
    const rightX = Math.max(fromX, posX);
    dispatch(selectRange({ from: leftX, to: rightX }));
  }

  function handleToggleSelection(evInfo) {
    if (evInfo.partId) {
      dispatch(toggleEntitySelection(evInfo.partId));
    }
    if (evInfo.channelId) {
      dispatch(selectImageChannel(evInfo.channelId));
    }
  }

  function handleMultiSelect(evInfo) {
    dispatch(toggleMultiEntitySelection(evInfo.partId));
  }

  // return the mouse event handling function to be used in the component
  return (eventName, evInfo) => handleChannelMouseEvent(eventName, evInfo)

}