// handles all mouse events for the move action for the parts in the channel
// gestures: click to select, drag to move

export default class TimeScaleMouseHandler {

  constructor(handlerFunctions) {
    this.handlerFunctions = handlerFunctions;
    this.inMove = false;
  }

  // TimeToPixels HOC wraps the Channel: pos is in secs
  handleMouseEvent = (eventName, evInfo) => {
    switch (eventName) {

      case "click":
        this.handleClick(evInfo);
        break;

      case "mouseMove":
        if (evInfo.markerType === "timescale") {
          this.handleMoveTo();
        } else {
          this.handleMoveFrom(evInfo);
        }
        break;

      case "mouseLeave":
        this.handleMoveTo();
        break;


      default:
        break;
    }
  }

  handleClick = (evInfo) => {
    if (evInfo.markerId && evInfo.markerType === "timeScale") {
      this.handlerFunctions.deleteMarker(evInfo.markerId);
    } else {
      const markerInfo = {
        //markerId will be generated
        pos: evInfo.x,
        type: "timeScale"
      };
      this.handlerFunctions.setOrReplaceMarker(markerInfo);
    }
  }

  handleMoveFrom = (evInfo) => {
    const markerInfo = {
      pos: evInfo.x,
      type: "insertTimeScale",
      markerId: "insertTimeScaleId" // just one of this type
    };
    this.handlerFunctions.setOrReplaceMarker(markerInfo);
    this.inMove = true;
  }

  handleMoveTo = () => {
    if (this.inMove) {
      this.handlerFunctions.deleteMarker("insertTimeScaleId");
      this.inMove = false;
    }
  }

}