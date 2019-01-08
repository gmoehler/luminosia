// handles all mouse events for the select action 

export default class SelectionMouseHandler {

  constructor(handlerFunctions){
    this.handlerFunctions = handlerFunctions;
    this.prevPosX = null;
    this.prevTimestamp = 0;
  }

  // if TimeToPixels HOC wraps the Channel then pos is in secs
  handleMouseEvent = (pos, eventName, timestamp) => {
    //console.log(pos, eventName);
    switch (eventName) {

      case "dragEnter":
      this.handleInsertMarker(pos, timestamp)
      break;

      case "dragOver":
      this.handleInsertMarker(pos, timestamp)
      break;

      case "drop":
      this.handleInsertImage(pos)
      break;

      default:
      break;
    }
  }

  handleInsertMarker = (pos, timestamp) => {
    // only realize marker move after some time intervals and larger steps
    if (!this.prevPosX || 
        (timestamp - this.prevTimestamp > 100 && Math.abs(pos.x - this.prevPosX) > 0.01)) { 
      console.log(pos.x, " ", timestamp, "drag");
      this.handlerFunctions.setMarker("insert", pos.x);
      this.prevPosX = pos.x;
      this.prevTimestamp = timestamp;
    }
  }

  handleInsertImage = (pos) => {
    console.log(pos.x, " drop");
    this.handlerFunctions.addPart(pos.channelId, "src", pos.x);
    this.prevPosX = null;
    this.prevTimestamp = 0;
  }

}