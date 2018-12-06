// handles all mouse events and selects the action from it

export default class SelectionMouseHandler {

  constructor(handlerFunctions, defaultMode){
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
    this.handlerFunctions.select(x, x);
  }

  handleMoveTo = (x, finalizeSelection) => {
    if (this.moveFromX) { // only when mouse down has occured
      console.log('move to: ', x);
      this.handlerFunctions.move(x - this.moveFromX);

      if (finalizeSelection) {
        this.moveFromX = null; 
      }
    }
  }
}