// handles all mouse events for the select action 

export default class SelectionMouseHandler {

  constructor(handlerFunctions) {
    this.handlerFunctions = handlerFunctions;
    this.prevPosX = null;
    this.prevTimestamp = 0;
  }

  // if TimeToPixels HOC wraps the Channel then pos is in secs
  handleMouseEvent = (eventName, evInfo) => {
    //console.log(evInfo, eventName);
    switch (eventName) {

      case "dragEnter":
        this.handleInsertMarker(evInfo);
        break;

      case "dragOver":
        this.handleInsertMarker(evInfo);
        break;

      case "drop":
        this.handleInsertImage(evInfo);
        break;

      default:
        break;
    }
  }

  handleInsertMarker = (evInfo, timestamp) => {
    // only realize marker move after some time intervals and larger steps
    if (!this.prevPosX ||
      (evInfo.timestamp - this.prevTimestamp > 100 && Math.abs(evInfo.x - this.prevPosX) > 0.01)) {
      // console.log(evInfo.x, " ", evInfo.timestamp, "drag");
      this.handlerFunctions.setMarker("insert", null, null, evInfo.x, 0, "insert");
      this.prevPosX = evInfo.x;
      this.prevTimestamp = evInfo.timestamp;
    }
  }

  handleInsertImage = (evInfo) => {
    // console.log(evInfo.x, " drop");
    // prevent drop of images that dont come from the ImageList
    if (evInfo.channelId && evInfo.imageId && evInfo.duration) {
      const channelId = parseInt(evInfo.channelId);
      this.handlerFunctions.insertNewPart(channelId, evInfo.imageId, evInfo.src, evInfo.x, evInfo.duration);
    } else {
    	this.handlerFunctions.setMessage("You cannot drop an image directly, drop it into the image view first.", "error", "Error");
    }
    this.prevPosX = null;
    this.prevTimestamp = 0;
  }

}