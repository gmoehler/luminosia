export function getMouseEventPosition(e, className, channelId) {

  // find div with className
  let el = e.target;
  const partId = el.getAttribute("data-partid");
  const markerId = el.getAttribute("data-markerid");
  while (el && el.classList && el.classList[0] !== className) {
    el = el.parentNode;
  }
  if (el && el.classList && el.classList[0] === className) {
    const parentScroll = el.parentNode ? el.parentNode.scrollLeft : 0;
    return {
      x: Math.max(0, e.clientX - el.offsetLeft + parentScroll),
      partId,
      markerId,
      channelId: String(channelId) // to allow simple boolean comparisons
    };
  }
  console.debug(`Event did not find ${className}`);
  return {
    x: 0,
    partId,
    markerId,
    channelId: String(channelId)
  };
}

export function isImplementedKey(e) {
  return ["Delete", "Backspace"].includes(e.key);
}