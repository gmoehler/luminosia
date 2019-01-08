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
        this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-l`, incrX);
        this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-r`, incrX);
      }

      if (finalizeSelection) {
        this.xOrigin = null;
        this.moveFromX = null; 
        this.partId = null;

        // TODO: clean markers after move?
        // this.handlerFunctions.clearMarker(`${this.channelId}-${this.partId}-l`);
        // this.handlerFunctions.clearMarker(`${this.channelId}-${this.partId}-r`);
      }
    }
  }
}