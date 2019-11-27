// handles all mouse events for the move action for the parts in the channel
// gestures: click to select, drag to move

export default class ChannelMouseHandler {

  constructor(handlerFunctions) {
    this.handlerFunctions = handlerFunctions;
    this.fromX = null;
    this.channelId = null;
    this.partId = null;
    this.markerId = null;
    this.keyAtMouseDown = null;
    // possible actions: anyMouseAction, moveResize, selectPartInRange, selectRange
    this.currAction = null;
  }

  // TimeToPixels HOC wraps the Channel: x pos is in secs
  handleMouseEvent = (eventName, evInfo) => {
    // console.log(eventName, this.currAction);
    const key = this.getKey(eventName);

    if (eventName === "keyDown") {
      this.handleKeyDown(evInfo);
    }
    else if (eventName.includes("mouseDown")) {
      this.resetAction();
      this.handleActionStart(evInfo, key);
    }
    else if (eventName.includes("mouseMove")) {
      if (this.currAction) {
        this.handleMoveTo(evInfo, false);
      }
    }
    else if (eventName.includes("mouseUp")) {
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
    }
    else if (eventName.includes("mouseLeave")) {
      if (this.currAction) {
        this.handleMoveTo(evInfo, true);
      }
    }
  }

  getKey(eventName) {
    const keys = eventName.split("-");
    keys.pop();
    return keys.length ? keys.join("-") : null;
  }

  resetAction() {
    if (this.currAction !== "selectRange") {
      this.handlerFunctions.deselectRange();
    }
    this.fromX = null;
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
    this.fromX = evInfo.x;
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
    const incrX = evInfo.x - this.fromX;
    if (Math.abs(incrX) > 0) {

      // only move selected when we select a part
      if (["anyMouseAction", "moveResize"].includes(this.currAction)
        && !this.keyAtMouseDown
        && this.fromX && this.partId && this.channelId) {
        // console.log(`move from ${this.moveFromX} to ${x}`);
        this.moveResizePart(incrX);
        this.fromX = evInfo.x;
      }

      if (["anyMouseAction", "selectRange"].includes(this.currAction)
        && this.keyAtMouseDown === "shift"
        && this.fromX && this.channelId) {
        this.selectRange(evInfo.x);
      }

      // ctrl within part or no key/ctrl outside
      if (["anyMouseAction", "selectPartInRange"].includes(this.currAction)
        && this.fromX && this.channelId) {
        this.selectPartInRange(evInfo.x);
      }
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
    const leftX = Math.min(this.fromX, posX);
    const rightX = Math.max(this.fromX, posX);

    this.handlerFunctions.selectRange(leftX, rightX, "temp");
    this.handlerFunctions.selectInInterval(this.channelId, leftX, rightX);
  }

  selectRange(posX) {
    if (this.currAction === "anyMouseAction") { //first time call
      this.currAction = "selectRange";
    }
    // console.log('selection to: ', posX);
    const leftX = Math.min(this.fromX, posX);
    const rightX = Math.max(this.fromX, posX);
    this.handlerFunctions.selectRange(leftX, rightX);
  }

  handleToggleSelection(evInfo) {
    if (evInfo.partId) {
      this.handlerFunctions.toggleEntitySelection(evInfo.partId);
    }
    if (evInfo.channelId) {
      this.handlerFunctions.selectImageChannel(evInfo.channelId);
    }
  }

  handleMultiSelect(evInfo) {
    this.handlerFunctions.toggleMultiEntitySelection(evInfo.partId);
  }

}