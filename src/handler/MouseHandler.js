
import MoveMouseHandler from './MoveMouseHandler'
import DropMouseHandler from './DropMouseHandler'

export default class MouseHandler {

  constructor(handlerFunctions) {
    this.moveMousehandler = new MoveMouseHandler(handlerFunctions);
    this.dropMouseHandler = new DropMouseHandler(handlerFunctions)
  }

  handleMouseEvent = (eventName, evInfo) => {
    if (eventName.includes("drag") || eventName.includes("drop")) {
      return this.dropMouseHandler.handleMouseEvent(eventName, evInfo);
    }
    return this.moveMousehandler.handleMouseEvent(eventName, evInfo);
  }

}