export function getMouseEventPosition(e, className, channelId) {

  // find div with className
  let el = e.target;
  const partId = el.getAttribute("data-partid");
  const markerId = el.getAttribute("data-markerid");
  const markerType = el.getAttribute("data-markertype");
  let position = 0;
  let cn = className;

  while (el && el.classList && !el.classList.contains(className)) {
    el = el.parentNode;
  }

  if (el && el.classList && el.classList.contains(className)) {
    const parentScroll = el.parentNode ? el.parentNode.scrollLeft : 0;
    position = Math.max(0, e.clientX - el.offsetLeft + parentScroll);
  } else {
    console.debug(`Event did not find ${className}`);
    cn = null;
  }

  return {
    x: position,
    partId,
    markerId,
    markerType,
    channelId,
    className: cn,
  };
}

export function isImplementedKey(e) {
  return ["Delete", "Backspace"].includes(e.key);
}

export function handleEvent(e, eventName, mouseHandler, wrapper4pos, channelId) {
  if (mouseHandler) {
    e.preventDefault();
    const pos = eventName !== "keyDown" ?
      getMouseEventPosition(e, wrapper4pos, channelId) : {};
    // transfer data is not available until drop (not on dragEnter / dragOver)
    const imageId = e.dataTransfer && e.dataTransfer.getData("imageid");
    const duration = e.dataTransfer && Number(e.dataTransfer.getData("duration"));
    const key = e.key;
    const shiftKey = e.shiftKey;
    const ctrlKey = e.ctrlKey;

    let adaptedEventName = eventName;
    if (shiftKey) {
      adaptedEventName = "shift-" + adaptedEventName;
    }
    if (ctrlKey) {
      adaptedEventName = "ctrl-" + adaptedEventName;
    }
    const evInfo = {
      ...pos, // x pos, channelId, partId, markerId, className
      timestamp: e.timeStamp,
      imageId,
      duration,
      key,
    };
    mouseHandler(adaptedEventName, evInfo);
    return;
  }
}