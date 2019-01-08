// handles all mouse events for the select action 

export default class SelectionMouseHandler {

  constructor(handlerFunctions){
    this.handlerFunctions = handlerFunctions;
    this.selectFromX = null;
  }

  // if TimeToPixels HOC wraps the Channel then pos is in secs
  handleMouseEvent = (evInfo, eventName) => {
    switch (eventName) {

      case "mouseDown":
      this.handleSelectionFrom(evInfo);
      break;

      case "mouseMove":
      this.handleSelectionTo(evInfo, false);
      break;

      case "mouseUp":
      this.handleSelectionTo(evInfo, true);
      break;

      case "mouseLeave":
      this.handleSelectionTo(evInfo, true);
      break;

      default:
      break;
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
      }
    }
  }
}