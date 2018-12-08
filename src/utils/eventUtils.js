export function getMouseEventPosition(e, className) {

    // find div with className
    let el = e.target;
    while (el && el.classList && el.classList[0] !== className) {
      el = el.parentNode;
    }
    if (el && el.classList && el.classList[0] === className) {
      const parentScroll = el.parentNode ? el.parentNode.scrollLeft : 0;
      return  Math.max(0, e.clientX - el.offsetLeft + parentScroll);
    }
    console.warn(`MouseEvent did not find ${className}`);
    return 0;
}