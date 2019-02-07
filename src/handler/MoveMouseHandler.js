// handles all mouse events for the move action

export default class MoveMouseHandler {

  constructor(handlerFunctions){
    this.handlerFunctions = handlerFunctions;
    this.moveFromX = null;
    this.channelId = null;
    this.partId = null;
    this.selected = false;
  }

  // if TimeToPixels HOC wraps the Channel then pos is in secs
  handleMouseEvent = (eventName, evInfo) => {
    switch (eventName) {

      case "keyDown":
      this.handleKeyDown(evInfo);
      break;

      // also handles click selection
      case "mouseDown":
      this.deselect();
      this.handleMoveFrom(evInfo);
      break;

      case "mouseMove":
      this.handleMoveTo(evInfo, false);
      break;

      case "mouseUp":
      this.handleMoveTo(evInfo, true);
      break;

      case "mouseLeave":
      this.handleMoveTo(evInfo, true);
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

      default:
      break;
    }
  }

  handleKeyDown = (evInfo) => {
    if(evInfo.key === "Delete" || evInfo.key === "Backspace" ) {
        this.handlerFunctions.deleteSelectedPartAndMarkers();
    }
  }
  
  handleMoveFrom = (evInfo) => {
    this.handlerFunctions.selectPartOrImage({
      channelId: evInfo.channelId,
      partId: evInfo.partId,
      selected: true  // select
    });

    this.moveFromX = evInfo.x;
    this.channelId = evInfo.channelId;
    this.partId = evInfo.partId;
  }

  handleMoveTo = (evInfo, finalizeSelection) => {
    if (this.moveFromX && this.partId && this.channelId) { 
      // only when mouse down has occured
      // console.log(`move from ${this.moveFromX} to ${x}`);
      const incrX = evInfo.x - this.moveFromX;
      if (Math.abs(incrX) > 0) {
        this.handlerFunctions.move(this.partId, incrX);
        this.moveFromX = evInfo.x; 
        // also move the markers
        this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-l`, incrX); // type = null:
        this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-r`, incrX); // dont change type
      }

      if (finalizeSelection) {
        // leave part selected after move
        this.xOrigin = null;
        this.moveFromX = null; 
        this.partId = null;
      }
    }
  }

  handleSelectionFrom = (evInfo) => {
    this.selectFromX = evInfo.x;
    this.handlerFunctions.select(evInfo.x, evInfo.x);
  }

  handleSelectionTo = (evInfo, finalizeSelection) => {
    if (this.selectFromX) { // only when mouse down has occured
      // console.log('selection to: ', x);
      if (this.selectFromX < evInfo.x) {
        this.handlerFunctions.select(this.selectFromX, evInfo.x);
      } else {
        this.handlerFunctions.select(evInfo.x, this.selectFromX);
      }
      if (finalizeSelection) {
        this.selectFromX = null; 
        this.selected = true;
      }
    }
  }

  deselect = () => {
    if (this.selected) {
      this.handlerFunctions.select(null, null);
      this.selected = false;
    }
  }

}