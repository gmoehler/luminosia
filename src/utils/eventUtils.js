export function getMouseEventPosition(e, className, channelId) {

    // find div with className
    let el = e.target;
    const partId = el.getAttribute("data-partid");
    while (el && el.classList && el.classList[0] !== className) {
      el = el.parentNode;
    }
    if (el && el.classList && el.classList[0] === className) {
      const parentScroll = el.parentNode ? el.parentNode.scrollLeft : 0;
      return  {
        x: Math.max(0, e.clientX - el.offsetLeft + parentScroll),
        partId,
        channelId
      }
    }
    console.warn(`MouseEvent did not find ${className}`);
    return {
      x: 0,
      partId,
      channelId
    }
}