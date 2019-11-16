// handles all mouse events for the move action for the parts in the timescale component
// gestures: drag to move

export default class TimeScaleMouseHandler {

  constructor(handlerFunctions) {
    this.handlerFunctions = handlerFunctions;
    this.inMove = false;
    this.markerId = null;
  }

  // TimeToPixels HOC wraps the Channel: pos is in secs
  handleMouseEvent = (eventName, evInfo) => {
    switch (eventName) {

      case "mouseDown":
        // stop move of insert marker
        this.handleMoveEnd(evInfo);
        // start move of timeScale marker
        this.handleMoveStart(evInfo);
        break;

      case "mouseUp":
        this.handleFinalizeMove(evInfo);
        this.handleMoveEnd(evInfo);
        break;

      case "mouseMove":
        this.handleMove(evInfo);
        break;

      case "mouseLeave":
        this.handleMoveEnd();
        break;

      default:
        break;
    }
  }

  handleFinalizeMove = (evInfo) => {
    if (this.markerId) {
      // end move of this marker
      this.markerId = null;
    } else {
      // create new timeScale marker
      const markerInfo = {
        //markerId will be generated
        pos: evInfo.x,
        type: "timeScale"
      };
      this.handlerFunctions.setOrReplaceMarker(markerInfo);
    }
  }

  handleMoveStart = (evInfo) => {
    // only move timeScale markers
    if (evInfo.markerId && evInfo.markerType === "timeScale") {
      this.markerId = evInfo.markerId;
    }
  }

  handleMove = (evInfo) => {
    const markerInfo = this.markerId ?
      {
        pos: evInfo.x,
        type: "timeScale",
        markerId: this.markerId
      } : {
        pos: evInfo.x,
        type: "insertTimeScale",
        markerId: "insertTimeScaleId" // just one of this type
      };
    this.handlerFunctions.setOrReplaceMarker(markerInfo);
  }

  handleMoveEnd = () => {
    if (!this.markerId) {
      this.handlerFunctions.deleteMarker("insertTimeScaleId");
    }
    this.markerId = null;
  }

}