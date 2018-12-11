export function getMouseEventPosition(e, className) {

    // find div with className
    let el = e.target;
    const src = el.attributes.src;
    while (el && el.classList && el.classList[0] !== className) {
      el = el.parentNode;
    }
    if (el && el.classList && el.classList[0] === className) {
      const parentScroll = el.parentNode ? el.parentNode.scrollLeft : 0;
      return  {
        x: Math.max(0, e.clientX - el.offsetLeft + parentScroll),
        src: src
      }
    }
    console.warn(`MouseEvent did not find ${className}`);
    return {
      x: 0,
      src: src
    }
}