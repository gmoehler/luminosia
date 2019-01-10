// handles all mouse events for the move action

export default class MoveMouseHandler {

  constructor(handlerFunctions){
    this.handlerFunctions = handlerFunctions;
    this.moveFromX = null;
    this.partId = null;
  }

  // if TimeToPixels HOC wraps the Channel then pos is in secs
  handleMouseEvent = (eventName, evInfo) => {
    switch (eventName) {

      case "mouseDown":
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

      default:
      break;
    }
  }

  handleMoveFrom = (evInfo) => {
    this.moveFromX = evInfo.x;
    this.channelId = evInfo.channelId;
    this.partId = evInfo.partId;

    // set type to selected
    this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-l`, 0, "selected");
    this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-r`, 0, "selected");
  }

  handleMoveTo = (evInfo, finalizeSelection) => {
    if (this.moveFromX && this.partId) { 
      // only when mouse down has occured
      // console.log(`move from ${this.moveFromX} to ${x}`);
      const incrX = evInfo.x - this.moveFromX;
      if (Math.abs(incrX) > 0) {
        this.handlerFunctions.move(this.partId, incrX);
        this.moveFromX = evInfo.x; 
        // also move the markers
        this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-l`, incrX, "selected");
        this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-r`, incrX, "selected");
      }

      if (finalizeSelection) {

        // set type back to normal
        this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-l`, 0, "");
        this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-r`, 0, "");

        this.xOrigin = null;
        this.moveFromX = null; 
        this.partId = null;
      }
    }
  }
}