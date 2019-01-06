// handles all mouse events for the select action 

export default class SelectionMouseHandler {

  constructor(handlerFunctions){
    this.handlerFunctions = handlerFunctions;
    this.selectFromX = null;
  }

  // if TimeToPixels HOC wraps the Channel then pos is in secs
  handleMouseEvent = (pos, eventName) => {
    console.log(pos, eventName);
    switch (eventName) {

      case "dragEnter":
      break;

      case "drop":
      break;

      default:
      break;
    }
  }

}