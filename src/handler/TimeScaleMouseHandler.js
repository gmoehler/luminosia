// handles all mouse events for the move action for the parts in the channel
// gestures: click to select, drag to move

export default class TimeScaleMouseHandler {

  constructor(handlerFunctions) {
    this.handlerFunctions = handlerFunctions;
  }

  // TimeToPixels HOC wraps the Channel: pos is in secs
  handleMouseEvent = (eventName, evInfo) => {
    switch (eventName) {

      case "click":
        this.handleClick(evInfo);
        break;

      default:
        break;
    }
  }

  handleClick = (evInfo) => {
    const markerInfo = {
      //markerId will be generated
      pos: evInfo.x,
      type: "timeScale"
    };
    this.handlerFunctions.setOrReplaceMarker(markerInfo);
  }


}