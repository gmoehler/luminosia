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
    this.selected = false;
    this.currAction = null;
  }

  // TimeToPixels HOC wraps the Channel: pos is in secs
  handleMouseEvent = (eventName, evInfo) => {
    // console.log(eventName);
    switch (eventName) {

      case "keyDown":
        this.handleKeyDown(evInfo);
        break;

      // also handles click selection
      case "mouseDown":
      case "ctrl-mouseDown":
        this.currAction = null; // reset
        this.deselectRange();
        this.handleMoveFrom(evInfo);
        break;

      case "mouseMove":
        this.handleMoveTo(evInfo, false);
        break;

      case "ctrl-mouseMove":
        this.handleMoveTo(evInfo, false, true);
        break;

      case "mouseUp":
      case "ctrl-mouseUp":
        this.handleMoveTo(evInfo, true);
        if (!this.currAction) {
          // only change selection at a simple click (no move)
          if (eventName === "ctrl-mouseUp") {
            this.handleMultiSelect(evInfo);
          } else {
            this.handleToggleSelection(evInfo);
          }
        }
        break;

      case "mouseLeave":
        this.handleMoveTo(evInfo, true);
        this.currAction = null;
        break;

      case "shift-mouseDown":
        this.handleMultiSelectFrom(evInfo);
        break;

      case "shift-mouseMove":
        this.handleMultiSelectTo(evInfo, false);
        break;

      case "shift-mouseUp":
        this.handleMultiSelectTo(evInfo, true);
        break;

      case "shift-mouseLeave":
        this.handleMultiSelectTo(evInfo, true);
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

  handleKeyDown = (evInfo) => {
    if (evInfo.key === "Delete" || evInfo.key === "Backspace") {
      this.handlerFunctions.deleteSelectedEntities();
    }
  }

  handleMoveFrom = (evInfo) => {
    // initialize for select, move & resize
    this.moveFromX = evInfo.x;
    this.channelId = evInfo.channelId;
    this.partId = evInfo.partId;
    this.markerId = evInfo.markerId; // for resize
  }

  handleToggleSelection = (evInfo) => {
    if (evInfo.partId) {
      this.handlerFunctions.toggleEntitySelection(evInfo.partId);
    }
    if (evInfo.channelId) {
      this.handlerFunctions.selectImageChannel(evInfo.channelId);
    }
  }

  handleMoveTo = (evInfo, finalizeAction, withCtrl = false) => {
    // only move selected when we select a part
    if (this.moveFromX && this.partId && this.channelId) {
      // only when mouse down has occured
      // console.log(`move from ${this.moveFromX} to ${x}`);
      const incrX = evInfo.x - this.moveFromX;
      if (Math.abs(incrX) > 0) {
        // now we know that it was a move or resize
        if (!this.currAction === "moveResize") {
          //first time call
          this.currAction = "moveResize";
          this.handlerFunctions.toggleInitialEntitySelection(evInfo.partId);
        }

        if (this.markerId) {
          this.handlerFunctions.resize(this.partId, this.markerId, incrX, !withCtrl);
        } else {
          this.handlerFunctions.move(this.partId, incrX, !withCtrl);
        }
        this.moveFromX = evInfo.x;
      }

      if (finalizeAction) {
        this.xOrigin = null;
        this.moveFromX = null;
        this.partId = null;
        this.markerId = null;
      }
    }
  }

  handleRangeFrom = (evInfo) => {
    this.selectFromX = evInfo.x;
    this.handlerFunctions.selectRange(evInfo.x, evInfo.x);
  }

  handleRangeTo = (evInfo, finalizeAction) => {
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

  handleMultiSelectFrom = (evInfo) => {
    this.selectFromX = evInfo.x;
    this.channelId = evInfo.channelId;
    this.handlerFunctions.selectRange(evInfo.x, evInfo.x, "temp");
    this.handlerFunctions.selectInInterval(evInfo.channelId, evInfo.x, evInfo.x);
  }

  handleMultiSelectTo = (evInfo, finalizeAction) => {
    if (this.selectFromX) { // only when mouse down has occured
      // console.log('selection to: ', x);
      if (this.selectFromX < evInfo.x) {
        this.handlerFunctions.selectRange(this.selectFromX, evInfo.x, "temp");
        this.handlerFunctions.selectInInterval(evInfo.channelId, this.selectFromX, evInfo.x);
      } else {
        this.handlerFunctions.selectRange(evInfo.x, this.selectFromX, "temp");
        this.handlerFunctions.selectInInterval(evInfo.channelId, evInfo.x, this.selectFromX);
      }
      if (finalizeAction) {
        // range selection is only temporarily
        this.handlerFunctions.deselectRange();
        this.selectFromX = null;
        this.selected = true;
      }
    }
  }

  handleMultiSelect = (evInfo) => {
    this.handlerFunctions.toggleMultiEntitySelection(evInfo.partId);
  }

  deselectRange = () => {
    if (this.selected) {
      this.handlerFunctions.deselectRange();
      this.selected = false;
    }
  }

}