// handles all mouse events and selects the action from it

export default class MouseHandler {

  constructor(handlerFunctions, defaultMode){
    this.handlerFunctions = handlerFunctions;
    this.selectFromX = null;
  }

  // get x from mouse event
  getMouseEventX = (e) => {
    // parent node is always the ChannelWrapper
    const bounds = e.target.parentNode.getBoundingClientRect();
    return Math.max(0, e.clientX - bounds.left);
  }

  handleSelectionFrom = (x) => {
    this.selectFromX = x;
    this.handlerFunctions.select(x, x);
  }

  handleSelectionTo = (x, finalizeSelection) => {
    if (this.selectFromX) { // only when mouse down has occured
      // console.log('mouse at: ', e.clientX - bounds.left);
      if (this.selectFromX < x) {
        this.handlerFunctions.select(this.selectFromX, x);
      } else {
        this.handlerFunctions.select(x, this.selectFromX);
      }
      if (finalizeSelection) {
        this.selectFromX = null; 
      }
    }
  }

  handleMouseDown = (e) => {
    e.preventDefault();
    const x = this.getMouseEventX(e);
    this.handleSelectionFrom(x);
  }

  handleMouseMove = (e) => {
    e.preventDefault();
    const x = this.getMouseEventX(e);
    this.handleSelectionTo(x, false);
  }

  handleMouseUp = (e) => {
    e.preventDefault();
    const x = this.getMouseEventX(e);
    this.handleSelectionTo(x, true);
  }

  handleMouseLeave = (e) => {
    e.preventDefault();
    const x = this.getMouseEventX(e);
    this.handleSelectionTo(x, true);
  } 




}