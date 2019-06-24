// handles all mouse events for the move action

export default class MoveMouseHandler {

  constructor(handlerFunctions) {
    this.handlerFunctions = handlerFunctions;
    this.moveFromX = null;
    this.channelId = null;
    this.partId = null;
    this.markerId = null;
    this.selected = false;
    this.inMove = false;
  }

  // TimeToPixels HOC wraps the Channel: pos is in secs
  handleMouseEvent = (eventName, evInfo) => {
    switch (eventName) {

      case "keyDown":
        this.handleKeyDown(evInfo);
        break;

      // also handles click selection
      case "mouseDown":
        this.inMove = false;
        this.deselectRange();
        this.handleMoveFrom(evInfo);
        break;

      case "mouseMove":
        this.handleMoveTo(evInfo, false);
        break;

      case "mouseUp":
        this.handleMoveTo(evInfo, true);
        if (!this.inMove) {
          // only change selection at a simple click (no move)
          this.handleToggleSelection(evInfo);
        }
        break;

      case "mouseLeave":
        this.handleMoveTo(evInfo, true);
        this.inMove = false;
        break;

      case "shift-mouseDown":
        this.handleSelectionFrom(evInfo);
        break;

      case "shift-mouseMove":
        this.handleSelectionTo(evInfo, false);
        break;

      case "shift-mouseUp":
        this.handleSelectionTo(evInfo, true);
        break;

      case "shift-mouseLeave":
        this.handleSelectionTo(evInfo, true);
        break;

      case "crtl-mouseUp":
        this.handleMultiSelect(evInfo);
        break;

      default:
        break;
    }
  }

  handleKeyDown = (evInfo) => {
    if (evInfo.key === "Delete" || evInfo.key === "Backspace") {
      this.handlerFunctions.deleteSelectedPartAndMarkers();
    }
  }

  handleMoveFrom = (evInfo) => {
    this.moveFromX = evInfo.x;
    this.channelId = evInfo.channelId;
    this.partId = evInfo.partId;
    this.markerId = evInfo.markerId; // for resize
  }

  handleToggleSelection = (evInfo) => {
    this.handlerFunctions.toggleElementSelection({
      channelId: parseInt(evInfo.channelId),
      partId: evInfo.partId,
    // selected: true // select
    });
  }

  handleMoveTo = (evInfo, finalizeAction) => {
    // only move selected when we select a part
    if (this.moveFromX && this.partId && this.channelId) {
      // only when mouse down has occured
      // console.log(`move from ${this.moveFromX} to ${x}`);
      const incrX = evInfo.x - this.moveFromX;
      if (Math.abs(incrX) > 0) {
        if (this.markerId) {
          this.handlerFunctions.resize(this.partId, this.markerId, incrX);
        } else {
          this.handlerFunctions.move(this.partId, incrX);
        }
        this.moveFromX = evInfo.x;
        this.inMove = true;
      }

      if (finalizeAction) {
        this.xOrigin = null;
        this.moveFromX = null;
        this.partId = null;
        this.markerId = null;
      }
    }
  }

  handleSelectionFrom = (evInfo) => {
    this.selectFromX = evInfo.x;
    this.handlerFunctions.selectRange(evInfo.x, evInfo.x);
    this.handlerFunctions.selectInInterval(evInfo.x, evInfo.x);
  }

  handleSelectionTo = (evInfo, finalizeAction) => {
    if (this.selectFromX) { // only when mouse down has occured
      // console.log('selection to: ', x);
      if (this.selectFromX < evInfo.x) {
        this.handlerFunctions.selectRange(this.selectFromX, evInfo.x);
        this.handlerFunctions.selectInInterval(this.selectFromX, evInfo.x);
      } else {
        this.handlerFunctions.selectRange(evInfo.x, this.selectFromX);
        this.handlerFunctions.selectInInterval(evInfo.x, this.selectFromX);
      }
      if (finalizeAction) {
        this.selectFromX = null;
        this.selected = true;
      }
    }
  }

  handleMultiSelect = (evInfo) => {
    this.handlerFunctions.toggleElementMultiSelection({
      channelId: parseInt(evInfo.channelId),
      partId: evInfo.partId,
    });
  }

  deselectRange = () => {
    if (this.selected) {
      this.handlerFunctions.deselectRange();
      this.selected = false;
    }
  }

}