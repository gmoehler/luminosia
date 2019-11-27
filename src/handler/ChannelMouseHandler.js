// handles all mouse events for the move action for the parts in the channel
// gestures: click to select, drag to move

export default class ChannelMouseHandler {

  constructor(handlerFunctions) {
    this.handlerFunctions = handlerFunctions;
    this.moveFromX = null;
    this.selectFromX = null;
    this.channelId = null;
    this.partId = null;
    this.markerId = null;
    // possible actions: "anyMouseAction", "moveResize", "selectPartInRange"
    this.currAction = null;
  }

  // TimeToPixels HOC wraps the Channel: pos is in secs
  handleMouseEvent = (eventName, evInfo) => {
    // console.log(eventName, this.currAction);
    switch (eventName) {

      case "keyDown":
        this.handleKeyDown(evInfo);
        break;

      // starts move, resize, selection actions
      case "mouseDown":
      case "ctrl-mouseDown":
      case "shift-mouseDown":
        this.resetAction();
        this.handleActionStart(evInfo);
        break;

      case "mouseMove":
      case "ctrl-mouseMove":
      case "shift-mouseMove":
        if (["anyMouseAction", "moveResize", "selectPartInRange"].includes(this.currAction)) {
          this.handleMoveTo(evInfo, false);
        }
        break;

      // ends move, resize, selection actions
      case "mouseUp":
      case "ctrl-mouseUp":
      case "shift-mouseUp":
        if (["moveResize", "selectPartInRange"].includes(this.currAction)) {
          this.handleMoveTo(evInfo, true);
        }
        else if (this.currAction ==="anyMouseAction"){
          // just a simple click (no move)
          if (eventName === "ctrl-mouseUp") {
            this.handleMultiSelect(evInfo);
          } else {
            this.handleToggleSelection(evInfo);
          }
        }
        break;

      case "mouseLeave":
      case "shift-mouseLeave":
      case "ctrl-mouseLeave":
        if (["anyMouseAction", "moveResize", "selectPartInRange"].includes(this.currAction)) {
          this.handleMoveTo(evInfo, true);
        }
        break;

      case "ctrl-shift-mouseDown":
        this.handleRangeFrom(evInfo);
        break;

      case "ctrl-shift-mouseMove":
        this.handleRangeTo(evInfo, false);
        break;

      case "ctrl-shift-mouseUp":
        this.handleRangeTo(evInfo, true);
        break;

      case "ctrl-shift-mouseLeave":
        this.handleRangeTo(evInfo, true);
        break;

      default:
        break;
    }
  }

  resetAction() {
    this.xOrigin = null;
    this.moveFromX = null;
    this.selectFromX = null;
    this.partId = null;
    this.markerId = null;
    this.currAction = null;
    this.handlerFunctions.deselectRange();
  }

  handleKeyDown(evInfo) {
    if (evInfo.key === "Delete" || evInfo.key === "Backspace") {
      this.handlerFunctions.deleteSelectedEntities();
    }
  }

  handleActionStart(evInfo) {
    // initialize for select, move & resize
    this.moveFromX = evInfo.x;
    this.selectFromX = evInfo.x;
    this.channelId = evInfo.channelId;
    this.partId = evInfo.partId;
    this.markerId = evInfo.markerId; // for resize
    this.currAction = "anyMouseAction";

    // start with selection (if clicked on part)...
    if (this.channelId && this.partId) {
      this.handlerFunctions.toggleInitialEntitySelection(evInfo.partId);
    } // ... or zero range
    else if (this.channelId) {
      this.handlerFunctions.selectRange(evInfo.x, evInfo.x, "temp");
    }
  }

  handleMoveTo(evInfo, finalizeAction) {

      const incrX = evInfo.x - this.moveFromX;
      if (Math.abs(incrX) > 0) {

        // only move selected when we select a part
        if (["anyMouseAction", "moveResize"].includes(this.currAction)
          && this.moveFromX && this.partId && this.channelId) {
          // console.log(`move from ${this.moveFromX} to ${x}`);
          this.moveResizePart(incrX);
        }

        if (["anyMouseAction", "selectPartInRange"].includes(this.currAction)
          && this.selectFromX && this.channelId) {
          this.selectPartInRange(evInfo.x);
        }

        this.moveFromX = evInfo.x;
      }

      if (finalizeAction) {
        this.resetAction();
      }
  }

  moveResizePart(incrX) {
    if (this.currAction === "anyMouseAction") { //first time call
      this.currAction = "moveResize";
    }

    if (this.markerId) {
      this.handlerFunctions.resize(this.partId, this.markerId, incrX);
    } else {
      this.handlerFunctions.move(this.partId, incrX);
    }
  }

  selectPartInRange = (posX) => {
    if (this.currAction === "anyMouseAction") { //first time call
      this.currAction = "selectPartInRange";
    }
    // console.log('selection to: ', posX);
    const leftX = Math.min(this.selectFromX, posX);
    const rightX = Math.max(this.selectFromX, posX);

    this.handlerFunctions.selectRange(leftX, rightX, "temp");
    this.handlerFunctions.selectInInterval(this.channelId, leftX, rightX);
  }

  handleToggleSelection(evInfo) {
    if (evInfo.partId) {
      this.handlerFunctions.toggleEntitySelection(evInfo.partId);
    }
    if (evInfo.channelId) {
      this.handlerFunctions.selectImageChannel(evInfo.channelId);
    }
  }

  handleRangeFrom(evInfo) {
    this.selectFromX = evInfo.x;
    this.handlerFunctions.selectRange(evInfo.x, evInfo.x);
  }

  handleRangeTo(evInfo, finalizeAction) {
    if (this.selectFromX) { // only when mouse down has occured
      // console.log('selection to: ', x);
      if (this.selectFromX < evInfo.x) {
        this.handlerFunctions.selectRange(this.selectFromX, evInfo.x);
      } else {
        this.handlerFunctions.selectRange(evInfo.x, this.selectFromX);
      }
      if (finalizeAction) {
        this.selectFromX = null;
        this.selected = true;
      }
    }
  }

  handleMultiSelect(evInfo) {
    this.handlerFunctions.toggleMultiEntitySelection(evInfo.partId);
  }

}