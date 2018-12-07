// handles all mouse events for the move action

export default class MoveMouseHandler {

  constructor(handlerFunctions){
    this.handlerFunctions = handlerFunctions;
    this.moveFromX = null;
  }

  handleMouseEvent = (x, eventName) => {
    switch (eventName) {

      case "mouseDown":
      this.handleMoveFrom(x);
      break;

      case "mouseMove":
      this.handleMoveTo(x, false);
      break;

      case "mouseUp":
      this.handleMoveTo(x, true);
      break;

      case "mouseLeave":
      this.handleMoveTo(x, true);
      break;

      default:
      break;
    }
  }

  handleMoveFrom = (x) => {
    this.moveFromX = x;
  }

  handleMoveTo = (x, finalizeSelection) => {
    if (this.moveFromX) { // only when mouse down has occured
      // console.log(`move from ${this.moveFromX} to ${x}`);
      const incrX = x - this.moveFromX;
      if (Math.abs(incrX) > 0) {
        this.handlerFunctions.move(incrX);
        this.moveFromX = x; 
      }

      if (finalizeSelection) {
        this.moveFromX = null; 
      }
    }
  }
}