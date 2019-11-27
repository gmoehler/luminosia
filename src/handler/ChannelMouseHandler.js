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
    this.keyAtMouseDown = null;
    // possible actions: anyMouseAction, moveResize, selectPartInRange, selectRange
    this.currAction = null;
  }

  getKey(eventName) {
    const keys = eventName.split("-");
    keys.pop();
    return keys.length ? keys.join("-") : null;
  }

  // TimeToPixels HOC wraps the Channel: pos is in secs
  handleMouseEvent = (eventName, evInfo) => {
    // console.log(eventName, this.currAction);
    const key = this.getKey(eventName);

    switch (eventName) {

      case "keyDown":
        this.handleKeyDown(evInfo);
        break;

      // starts move, resize, selection actions
      case "mouseDown":
      case "ctrl-mouseDown":
      case "shift-mouseDown":
        // console.log("down", this.currAction);
        this.resetAction();
        this.handleActionStart(evInfo, key);
        // console.log("down2", this.currAction);
        break;

      case "mouseMove":
      case "ctrl-mouseMove":
      case "shift-mouseMove":
        //console.log("move", this.currAction);
        if (this.currAction) {
          this.handleMoveTo(evInfo, false);
        }
        //console.log("move2", this.currAction);
        break;

      // ends move, resize, selection actions
      case "mouseUp":
      case "ctrl-mouseUp":
      case "shift-mouseUp":
        //console.log("up", this.currAction);
        if (this.currAction === "anyMouseAction") {
          // just a simple click (no move)
          if (eventName === "ctrl-mouseUp") {
            this.handleMultiSelect(evInfo);
          } else {
            this.handleToggleSelection(evInfo);
          }
          this.resetAction();
        } else if (this.currAction) {
          this.handleMoveTo(evInfo, true);
        }

        // console.log("up2", this.currAction);
        break;

      case "mouseLeave":
      case "shift-mouseLeave":
      case "ctrl-mouseLeave":
        //console.log("leave", this.currAction);
        if (this.currAction) {
          this.handleMoveTo(evInfo, true);
        }
        break;

      default:
        break;
    }
  }

  resetAction() {
    if (this.currAction !== "selectRange") {
      this.handlerFunctions.deselectRange();
    }
    this.moveFromX = null;
    this.selectFromX = null;
    this.channelId = null;
    this.partId = null;
    this.markerId = null;
    this.keyAtMouseDown = null;
    this.currAction = null;
  }

  handleKeyDown(evInfo) {
    if (evInfo.key === "Delete" || evInfo.key === "Backspace") {
      this.handlerFunctions.deleteSelectedEntities();
    }
  }

  handleActionStart(evInfo, key) {
    // initialize for select, move & resize
    this.moveFromX = evInfo.x;
    this.selectFromX = evInfo.x;
    this.channelId = evInfo.channelId;
    this.partId = evInfo.partId;
    this.markerId = evInfo.markerId; // for resize
    this.keyAtMouseDown = key;
    this.currAction = "anyMouseAction";

    // start with selection (if clicked on part)...
    if (this.channelId && this.partId && !key) {
      // select exclusively if not selected, do nothing when selected
      this.handlerFunctions.toggleInitialEntitySelection(evInfo.partId);
    } // ... or zero range
    else if (this.channelId && !this.partId) {
      this.handlerFunctions.selectRange(evInfo.x, evInfo.x, "temp");
    }
  }

  handleMoveTo(evInfo, finalizeAction) {

    const incrX = evInfo.x - this.moveFromX;
    if (Math.abs(incrX) > 0) {

      // only move selected when we select a part
      if (["anyMouseAction", "moveResize"].includes(this.currAction)
        && !this.keyAtMouseDown
        && this.moveFromX && this.partId && this.channelId) {
        // console.log(`move from ${this.moveFromX} to ${x}`);
        this.moveResizePart(incrX);
      }

      if (["anyMouseAction", "selectRange"].includes(this.currAction)
        && this.keyAtMouseDown === "shift"
        && this.selectFromX && this.channelId) {
        this.selectRange(evInfo.x);
      }

      // ctrl within part or no key/ctrl outside
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

  selectRange(posX) {
    if (this.currAction === "anyMouseAction") { //first time call
      this.currAction = "selectRange";
    }
    // console.log('selection to: ', posX);
    const leftX = Math.min(this.selectFromX, posX);
    const rightX = Math.max(this.selectFromX, posX);
    this.handlerFunctions.selectRange(leftX, rightX);
  }

  handleMultiSelect(evInfo) {
    this.handlerFunctions.toggleMultiEntitySelection(evInfo.partId);
  }

}