// handles all mouse events for the select action 

export default class SelectionMouseHandler {

  constructor(handlerFunctions){
    this.handlerFunctions = handlerFunctions;
    this.selectFromX = null;
  }

  // if TimeToPixels HOC wraps the Channel then pos is in secs
  handleMouseEvent = (pos, eventName) => {
    switch (eventName) {

      case "mouseDown":
      this.handleSelectionFrom(pos);
      break;

      case "mouseMove":
      this.handleSelectionTo(pos, false);
      break;

      case "mouseUp":
      this.handleSelectionTo(pos, true);
      break;

      case "mouseLeave":
      this.handleSelectionTo(pos, true);
      break;

      default:
      break;
    }
  }

  handleSelectionFrom = (pos) => {
    this.selectFromX = pos.x;
    this.handlerFunctions.select(pos.x, pos.x);
  }

  handleSelectionTo = (pos, finalizeSelection) => {
    if (this.selectFromX) { // only when mouse down has occured
      // console.log('selection to: ', x);
      if (this.selectFromX < pos.x) {
        this.handlerFunctions.select(this.selectFromX, pos.x);
      } else {
        this.handlerFunctions.select(pos.x, this.selectFromX);
      }
      if (finalizeSelection) {
        this.selectFromX = null; 
      }
    }
  }
}