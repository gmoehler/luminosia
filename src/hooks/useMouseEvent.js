

// handles all mouse events for the select action 

import { pixelsToSeconds } from "../utils/conversions";
import { useChannelMouseEvent } from "./useChannelMouseEvent";
import { useDropMouseEvent } from "./useDropMouseEvent";
import { useTimeScaleMouseEvent } from "./useTimeScaleMouseEvent";

export function useMouseEvent(channelId, wrapperClassForPosition, resolution) {

  const handleTimeScaleMouseEvent = useTimeScaleMouseEvent();
  const handleChannelMouseEvent = useChannelMouseEvent(channelId);
  const handleDropMouseEevent = useDropMouseEvent();

  function handleEvent(eventName, e) {
    e.preventDefault();
    const pos = eventName !== "keyDown" ?
      getMouseEventPosition(e, wrapperClassForPosition, channelId) : {};
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
    handleSpecificMouseEvent(adaptedEventName, evInfo);
    return;
  }

  // decide which mouse handler to use
  function handleSpecificMouseEvent(eventName, evInfo) {
    if (eventName.includes("drag") || eventName.includes("drop")) {
      handleDropMouseEevent(eventName, evInfo);
    }
    else if (evInfo.className === "PlaylistTimeScale") {
      handleTimeScaleMouseEvent(eventName, evInfo);
    }
    else {
      handleChannelMouseEvent(eventName, evInfo);
    }
  }

  function getMouseEventPosition(e, className, channelId) {

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

    const x = pixelsToSeconds(position, resolution);

    return {
      x,
      partId,
      markerId,
      markerType,
      channelId,
      className: cn,
    };
  }

  // return the mouse event handling function to be used in the component
  return (eventName, evInfo) => handleEvent(eventName, evInfo)
}