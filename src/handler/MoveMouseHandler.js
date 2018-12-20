// handles all mouse events for the move action

export default class MoveMouseHandler {

  constructor(handlerFunctions){
    this.handlerFunctions = handlerFunctions;
    this.moveFromX = null;
    this.partId = null;
  }

  // if TimeToPixels HOC wraps the Channel then pos is in secs
  handleMouseEvent = (pos, eventName) => {
    switch (eventName) {

      case "mouseDown":
      this.handleMoveFrom(pos);
      break;

      case "mouseMove":
      this.handleMoveTo(pos, false);
      break;

      case "mouseUp":
      this.handleMoveTo(pos, true);
      break;

      case "mouseLeave":
      this.handleMoveTo(pos, true);
      break;

      default:
      break;
    }
  }

  handleMoveFrom = (pos) => {
    this.moveFromX = pos.x;
    this.partId = pos.partId;
  }

  handleMoveTo = (pos, finalizeSelection) => {
    if (this.moveFromX && this.partId) { 
      // only when mouse down has occured
      // console.log(`move from ${this.moveFromX} to ${x}`);
      const incrX = pos.x - this.moveFromX;
      if (Math.abs(incrX) > 0) {
        this.handlerFunctions.move(this.partId, incrX);
        this.moveFromX = pos.x; 
      }

      if (finalizeSelection) {
        this.moveFromX = null; 
        this.partId = null;
      }
    }
  }
}