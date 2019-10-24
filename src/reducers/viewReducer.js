
import { CLEAR_VIEW, LOAD_SHOW_STARTED, LOAD_SHOW_SUCCESS, LOAD_SHOW_FAILURE, SELECT_RANGE, DESELECT_RANGE, SET_RESOLUTION, SELECT_IMAGE_CHANNEL, COPY_PART, ADD_TO_UPLOAD_LOG, CLEAR_UPLOAD_LOG, SET_MESSAGE, CLEAR_MESSAGE } from "../actions/types";

// export for tests
export const initialState = {
  selection: {
    from: null,
    to: null,
    type: null,
  },
  resolution: 80,
  selectedImageChannelId: null,
  partsToCopy: null,
  uploadLog: null,
  loadShowStatus: null,
  message: null,
};

export default (state = initialState, action) => {
  switch (action.type) {

    case CLEAR_VIEW:
      return initialState;

    case LOAD_SHOW_STARTED:
      return {
        ...state,
        loadShowStatus: "started"
      };

    case LOAD_SHOW_SUCCESS:
      return {
        ...state,
        loadShowStatus: "success"
      };

    case LOAD_SHOW_FAILURE:
      return {
        ...state,
        loadShowStatus: "failure"
      };

    case SELECT_RANGE:
      return {
        ...state,
        selection: {
          from: action.payload.from,
          to: action.payload.to,
          type: action.payload.type
        }
      };

    case DESELECT_RANGE:
      return {
        ...state,
        selection: {
          from: null,
          to: null,
          type: null,
        }
      };

    case SELECT_IMAGE_CHANNEL:
      return {
        ...state,
        selectedImageChannelId: action.payload.channelId
      };

    case SET_RESOLUTION:
      return {
        ...state,
        resolution: action.payload
      };

    case COPY_PART:
      /*  if (_getSelectionType(state) !== "part") {
         return state;
       }
       // duplicate parts array
       const partsToCopy = _getSelectedElements(state).slice(0);
       return {
         ...state,
         partsToCopy
       }; */
      return state;

    case ADD_TO_UPLOAD_LOG:
      return {
        ...state,
        uploadLog: state.uploadLog ? state.uploadLog + action.payload : action.payload
      };

    case CLEAR_UPLOAD_LOG:
      return {
        ...state,
        uploadLog: null
      };

    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload
      };

    case CLEAR_MESSAGE:
      return {
        ...state,
        message: null
      };

    default:
      return state;
  }
};

export const getSelectionRange = (state) => {
  return {
    from: state.view.selection.from,
    to: state.view.selection.to,
    type: state.view.selection.type,
  };
};

export const getResolution = (state) => {
  return state.view.resolution;
};

export const getPartsToCopy = (state) => {
  return state.view.partsToCopy;
};

export const getSelectedImageChannelId = (state) => state.view.selectedImageChannelId;

export const getUploadLog = (state) => state.view.uploadLog;

export const getMessage = (state) => state.view.message;

export const isUploadingShow = (state) => {
  return state.view.uploadShowStatus === "started";
};
