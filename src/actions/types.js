// action type constants

// channel actions
export const ADD_CHANNEL = "ADD_CHANNEL";
export const DELETE_CHANNEL = "DELETE_CHANNEL";
export const CLEAR_CHANNELS = "CLEAR_CHANNELS";
export const UPDATE_CHANNEL = "UPDATE_CHANNEL";
export const SET_CHANNEL_ACTIVE = "SET_CHANNEL_ACTIVE";
export const SET_CHANNEL_INACTIVE = "SET_CHANNEL_INACTIVE";
export const PLAY_CHANNELS = "PLAY_CHANNELS";
export const STOP_CHANNEL = "STOP_CHANNEL";
export const STOP_CHANNELS = "STOP_CHANNELS";

// general entity actions
export const SELECT_ENTITY = "SELECT_ENTITY";
export const DESELECT_ENTITY = "DESELECT_ENTITY";
export const CLEAR_ENTITY_SELECTION = "CLEAR_ENTITY_SELECTION";
export const COPY_ENTITIES = "COPY_ENTITIES";

// image list actions
export const CLEAR_IMAGELIST = "CLEAR_IMAGELIST";
export const ADD_IMAGE = "ADD_IMAGE";
export const REMOVE_IMAGE = "REMOVE_IMAGE";

// part actions
export const CLEAR_PARTS = "CLEAR_PARTS";
export const ADD_PART = "ADD_PART";
export const DELETE_PART = "DELETE_PART";
export const MOVE_PART = "MOVE_PART";
export const MOVE_PARTS = "MOVE_PARTS";
export const RESIZE_PART = "RESIZE_PART";

// marker actions
export const CLEAR_MARKERS = "CLEAR_MARKERS";
export const SET_OR_REPLACE_MARKER = "SET_OR_REPLACE_MARKER";
export const DELETE_MARKER = "DELETE_MARKER";
export const UPDATE_MARKER = "UPDATE_MARKER";

// io actions
export const LOAD_SHOW_STARTED = "LOAD_SHOW_STARTED";
export const LOAD_SHOW_SUCCESS = "LOAD_SHOW_SUCCESS";
export const LOAD_SHOW_FAILURE = "LOAD_SHOW_FAILURE";

export const LOAD_AUDIO_STARTED = "LOAD_AUDIO_STARTED";
export const LOAD_AUDIO_SUCCESS = "LOAD_AUDIO_SUCCESS";
export const LOAD_AUDIO_FAILURE = "LOAD_AUDIO_FAILURE";

export const INIT_LOAD_PROGRESS = "INIT_LOAD_PROGRESS";
export const SET_LOAD_PROGRESS = "SET_LOAD_PROGRESS";
export const INCR_LOAD_PROGRESS = "INCR_LOAD_PROGRESS;";

// view actions
export const CLEAR_VIEW = "CLEAR_VIEW";
export const SELECT_RANGE = "SELECT_RANGE";
export const DESELECT_RANGE = "DESELECT_RANGE";
export const SET_RESOLUTION = "SET_RESOLUTION";
export const SET_CHANNEL_PLAY_STATE = "SET_CHANNEL_PLAY_STATE";

export const SELECT_IMAGE_CHANNEL = "SELECT_IMAGE_CHANNEL";
export const ADD_TO_UPLOAD_LOG = "ADD_TO_UPLOAD_LOG";
export const CLEAR_UPLOAD_LOG = "CLEAR_UPLOAD_LOG";
export const SET_MESSAGE = "SET_MESSAGE";
export const CLEAR_MESSAGE = "CLEAR_MESSAGE";