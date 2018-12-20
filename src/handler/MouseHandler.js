import SelectionMouseHandler from './SelectionMouseHandler';
import MoveMouseHandler from './MoveMouseHandler'


export default class MouseHandler {

  constructor(handlerFunctions){
    this.selectionMousehandler = new SelectionMouseHandler(handlerFunctions);
    this.moveMousehandler = new MoveMouseHandler(handlerFunctions);
    this.mousehandler = this.selectionMousehandler;
  }

  setMode = (mode) => {
    switch(mode) {
      case "selectionMode":
        this.mousehandler = this.selectionMousehandler;
        break;
      case "moveMode":
        this.mousehandler =  this.moveMousehandler;
        break;
      default:
        console.log("unknown mode " + mode);
        this.mousehandler =  this.selectionMousehandler;
      }
  }

  // if TimeToPixels HOC wraps the Channel then x is in secs
  handleMouseEvent = (x, eventName) => {
    return this.mousehandler.handleMouseEvent(x, eventName);
  }

}