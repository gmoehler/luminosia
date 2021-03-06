
import {
  CLEAR_VIEW, LOAD_SHOW_STARTED, LOAD_SHOW_SUCCESS, LOAD_SHOW_FAILURE,
  SELECT_RANGE, DESELECT_RANGE, SET_RESOLUTION, SELECT_IMAGE_CHANNEL,
  ADD_TO_UPLOAD_LOG, CLEAR_UPLOAD_LOG, SET_MESSAGE, CLEAR_MESSAGE, SET_LOAD_PROGRESS,
  INCR_LOAD_PROGRESS, INIT_LOAD_PROGRESS, TOGGLE_SNAP_TO_MARKER
} from "../actions/types";

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
  loadProgress: {
    base: 100,
    progress: 0
  },
  snapToMarkers: true,
};


/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
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

    case INIT_LOAD_PROGRESS:
      return {
        ...state,
        loadProgress: {
          base: action.payload || 100,
          progress: 0,
        }
      };

    case SET_LOAD_PROGRESS:
      return {
        ...state,
        loadProgress: {
          ...state.loadProgress,
          progress: action.payload,
        }
      };

    case INCR_LOAD_PROGRESS:
      const incr = action.payload || 1;
      const updatedProgress = state.loadProgress.progress + incr;
      return {
        ...state,
        loadProgress: {
          ...state.loadProgress,
          progress: updatedProgress > state.loadProgress.base ? state.loadProgress.base : updatedProgress,
        }
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
        selectedImageChannelId: action.payload
      };

    case SET_RESOLUTION:
      return {
        ...state,
        resolution: action.payload
      };

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

    case TOGGLE_SNAP_TO_MARKER:
      return {
        ...state,
        snapToMarkers: !state.snapToMarkers,
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

export const isLoadingShow = (state) => {
  return state.view.loadShowStatus === "started";
};

export const getLoadProgressInPercent = (state) => {
  return 100.0 * state.view.loadProgress.progress / state.view.loadProgress.base;
};

export const getSnapToMarkers = (state) => {
  return state.view.snapToMarkers;
};
