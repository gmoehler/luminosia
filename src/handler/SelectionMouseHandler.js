// handles all mouse events and selects the action from it

export default class SelectionMouseHandler {

  constructor(handlerFunctions, defaultMode){
    this.handlerFunctions = handlerFunctions;
    this.selectFromX = null;
  }

  handleMouseEvent = (x, eventName) => {
    switch (eventName) {

      case "mouseDown":
      this.handleSelectionFrom(x);
      break;

      case "mouseMove":
      this.handleSelectionTo(x, false);
      break;

      case "mouseUp":
      this.handleSelectionTo(x, true);
      break;

      case "mouseLeave":
      this.handleSelectionTo(x, true);
      break;

      default:
      break;
    }
  }

  handleSelectionFrom = (x) => {
    this.selectFromX = x;
    this.handlerFunctions.select(x, x);
  }

  handleSelectionTo = (x, finalizeSelection) => {
    if (this.selectFromX) { // only when mouse down has occured
      // console.log('mouse at: ', e.clientX - bounds.left);
      if (this.selectFromX < x) {
        this.handlerFunctions.select(this.selectFromX, x);
      } else {
        this.handlerFunctions.select(x, this.selectFromX);
      }
      if (finalizeSelection) {
        this.selectFromX = null; 
      }
    }
  }
}