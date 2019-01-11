// handles all mouse events for the move action

export default class MoveMouseHandler {

  constructor(handlerFunctions){
    this.handlerFunctions = handlerFunctions;
    this.moveFromX = null;
    this.channelId = null;
    this.partId = null;
    this.selected = false;
  }

  // if TimeToPixels HOC wraps the Channel then pos is in secs
  handleMouseEvent = (eventName, evInfo) => {
    switch (eventName) {

      case "click":
      this.handleClick(evInfo);
      break;

      case "keyDown":
      this.handleKeyDown(evInfo);
      break;

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

  handleKeyDown = (evInfo) => {

    this.handlerFunctions.deletePart({
      channelId: evInfo.channelId,
      partId: evInfo.partId,
    });
  }

  handleClick = (evInfo) => {

    this.handlerFunctions.selectPart({
      channelId: evInfo.channelId,
      partId: evInfo.partId,
      selected: evInfo.selected ? false: true  // toggle selected
    });
  }
  
  handleMoveFrom = (evInfo) => {

    this.handlerFunctions.selectPart({
      channelId: evInfo.channelId,
      partId: evInfo.partId,
      selected: true  // select
    });

    this.moveFromX = evInfo.x;
    this.channelId = evInfo.channelId;
    this.partId = evInfo.partId;
  }

  handleMoveTo = (evInfo, finalizeSelection) => {
    if (this.moveFromX && this.partId && this.channelId) { 
      // only when mouse down has occured
      // console.log(`move from ${this.moveFromX} to ${x}`);
      const incrX = evInfo.x - this.moveFromX;
      if (Math.abs(incrX) > 0) {
        this.handlerFunctions.move(this.partId, incrX);
        this.moveFromX = evInfo.x; 
        // also move the markers
        this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-l`, incrX); // type = null:
        this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-r`, incrX); // dont change type
      }

      if (finalizeSelection) {
        // leave part selected after move
        this.xOrigin = null;
        this.moveFromX = null; 
        this.partId = null;
      }
    }
  }
}