
import ChannelMouseHandler from "./ChannelMouseHandler";
import DropMouseHandler from "./DropMouseHandler";
import TimeScaleMouseHandler from "./TimeScaleMouseHandler";

export default class MouseHandler {

  constructor(handlerFunctions) {
    this.channelMousehandler = new ChannelMouseHandler(handlerFunctions);
    this.dropMouseHandler = new DropMouseHandler(handlerFunctions);
    this.timeScaleMouseHandler = new TimeScaleMouseHandler(handlerFunctions);
  }

  handleMouseEvent = (eventName, evInfo) => {
    if (eventName.includes("drag") || eventName.includes("drop")) {
      return this.dropMouseHandler.handleMouseEvent(eventName, evInfo);
    }
    if (eventName.includes("click")) {
      return this.timeScaleMouseHandler.handleMouseEvent(eventName, evInfo);
    }
    return this.channelMousehandler.handleMouseEvent(eventName, evInfo);
  }

}