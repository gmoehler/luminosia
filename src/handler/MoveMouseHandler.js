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

  handleClick = (evInfo) => {
    if (this.partId === evInfo.partId && 
		this.channelId === evInfo.channelId ) {
	    // toggle previously selected
    	this.selected = !this.selected; 
        this.updateMarkers();
    } else {
      if (this.selected && this.channelId && this.partId) {
    	  //deselect previously selected part
          this.selected = false;
    	  this.updateMarkers();
      }
  	this.channelId = evInfo.channelId;
  	this.partId = evInfo.partId;
      this.selected = true;
      this.updateMarkers();
     }
  }
  
  handleMoveFrom = (evInfo) => {
  	
    if (this.selected && 
         this.channelId && this.partId && 
		 (this.partId !== evInfo.partId || 
		  this.channelId !== evInfo.channelId)) {
    	//deselect previously selected part
        this.selected = false;
    	this.updateMarkers();
    }
      
    this.moveFromX = evInfo.x;
    this.channelId = evInfo.channelId;
    this.partId = evInfo.partId;

    // set marker type to selected
    this.selected = true;
    this.updateMarkers();
  }
  
  updateMarkers = ()  => {
    const type = this.selected ? "selected" : "";
    this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-l`, 0, type);
    this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-r`, 0, type);
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
        this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-l`, incrX, "selected");
        this.handlerFunctions.updateMarker(`${this.channelId}-${this.partId}-r`, incrX, "selected");
      }

      if (finalizeSelection) {

        // leave part selected

        this.xOrigin = null;
        this.moveFromX = null; 
        this.partId = null;
      }
    }
  }
}