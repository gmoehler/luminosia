import { useReducer, useState } from 'react';
import { useDispatch } from 'react-redux'
import { toggleEntitySelection, toggleMultiEntitySelection } from '../actions/entityActions';
import { addImage } from '../actions/imageListActions';
import { setMessage } from '../actions/viewActions';
import { samplesToSeconds } from '../utils/conversions';


const initialState = { count: 0 };

function counterReducer(state, action) {
  switch (action.type) {
    case 'reset':
      return { count: 0 };
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

// handles all mouse events for the dragg action in the ImageList

export function useImageDnDMouseEvent(sampleRate) {

  const [dragging, setDragging] = useState(false);
  const [draggingCounterState, dispatchDraggingCounter] =
    useReducer(counterReducer, initialState);
  const dispatch = useDispatch();

  // if TimeToPixels HOC wraps the Channel then pos is in secs
  function handleMouseEvent(eventName, e) {
    //console.log(evInfo, eventName);
    e.preventDefault();
    e.stopPropagation();

    switch (eventName) {

      case "mouseUp":
        handleSelectImage(e);
        break;

      case "dragEnter":
        startDrag();
        break;

      case "dragLeave":
        endDrag();
        break;

      case "drop":
        dropImage(e);
        break;

      default:
        break;
    }
  }

  function handleSelectImage(e) {
    let el = e.target;
    const imageId = el.getAttribute("data-imageid");
    if (e.ctrlKey) {
      dispatch(toggleMultiEntitySelection(imageId));
    } else {
      dispatch(toggleEntitySelection(imageId));
    }
  }

  function startDrag() {
    dispatchDraggingCounter({ type: 'increment' });
    setDragging(true);
  }

  function endDrag() {
    dispatchDraggingCounter({ type: 'decrement' });
    if (draggingCounterState.count <= 0) {
      setDragging(false);
      dispatchDraggingCounter({ type: 'reset' });
    }
  }

  function dropImage(e) {
    setDragging(false);
    dispatchDraggingCounter({ type: 'reset' });

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileList = e.dataTransfer.files;
      for (var i = 0; i < fileList.length; i++) {
        loadImageAndAddToStore(fileList[i]);
      }
    }
  }

  function loadImageAndAddToStore(file) {
    var reader = new FileReader();
    var img = new Image();

    reader.onload = function (e) {
      img.src = reader.result;
    };
    img.onload = function () {

      if (img.height !== 30) {
        dispatch(setMessage({
          type: "error",
          title: "Wrong image size",
          text: `The dragged image ${file.name} has a height of ${img.height}. However, you can only add images with a height of 30 pixels.`
        }));
      } else {
        const newImage = {
          width: img.width,
          height: img.height,
          src: reader.result,
          filename: file.name,
          sampleRate,
          duration: samplesToSeconds(img.width, sampleRate)
        };
        dispatch(addImage(newImage));
      }
    };
    reader.readAsDataURL(file);
  }

  // return the mouse event handling function to be used in the component
  return [
    (eventName, evInfo) => handleMouseEvent(eventName, evInfo),
    dragging
  ]
}