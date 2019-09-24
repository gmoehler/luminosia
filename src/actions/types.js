// action type constants

// general actions
export const UPLOAD_CONFIG_STARTED = "UPLOAD_CONFIG_STARTED";
export const UPLOAD_CONFIG_SUCCESS = "UPLOAD_CONFIG_SUCCESS";
export const UPLOAD_CONFIG_FAILURE = "UPLOAD_CONFIG_FAILURE";

// channel actions
export const ADD_CHANNEL = "ADD_CHANNEL";
export const DELETE_CHANNEL = "DELETE_CHANNEL";
export const CLEAR_CHANNELS = "CLEAR_CHANNELS";
export const SET_CHANNEL_ACTIVE = "SET_CHANNEL_ACTIVE";
export const UNSET_CHANNEL_ACTIVE = "UNSET_CHANNEL_ACTIVE";
export const UPDATE_CHANNEL = "UPDATE_CHANNEL";

export const UPLOAD_AUDIO_STARTED = "UPLOAD_AUDIO_STARTED";
export const UPLOAD_AUDIO_SUCCESS = "UPLOAD_AUDIO_SUCCESS";
export const UPLOAD_AUDIO_FAILURE = "UPLOAD_AUDIO_FAILURE";

export const PLAY_CHANNELS = "PLAY_CHANNELS";
export const STOP_CHANNELS = "STOP_CHANNELS";

// general entity actions
export const SELECT_ENTITY = "SELECT_ENTITY";
export const DESELECT_ENTITY = "DESELECT_ENTITY";
export const CLEAR_ENTITY_SELECTION = "CLEAR_ENTITY_SELECTION";

// image list actions
export const CLEAR_IMAGELIST = "CLEAR_IMAGELIST";
export const ADD_IMAGE = "ADD_IMAGE";
export const REMOVE_IMAGE = "REMOVE_IMAGE";

// part actions
export const CLEAR_PARTS = "CLEAR_PARTS";
export const ADD_A_PART = "ADD_A_PART";
export const DELETE_A_PART = "DELETE_A_PART";
export const MOVE_A_PART = "MOVE_A_PART";
export const RESIZE_A_PART = "RESIZE_A_PART";

// marker actions
export const CLEAR_MARKERS = "CLEAR_MARKERS";
export const SET_OR_REPLACE_A_MARKER = "SET_OR_REPLACE_A_MARKER";
export const DELETE_A_MARKER = "DELETE_A_MARKER";
export const UPDATE_A_MARKER = "UPDATE_A_MARKER";

// view actions
export const CLEAR_VIEW = "CLEAR_VIEW";
export const SELECT_RANGE = "SELECT_RANGE";
export const DESELECT_RANGE = "DESELECT_RANGE";
export const SET_RESOLUTION = "SET_RESOLUTION";
export const SET_CHANNEL_PLAY_STATE = "SET_CHANNEL_PLAY_STATE";

export const COPY_PART = "COPY_PART";
export const SELECT_IMAGE_CHANNEL = "SELECT_IMAGE_CHANNEL";
export const ADD_TO_UPLOAD_LOG = "ADD_TO_UPLOAD_LOG";
export const CLEAR_UPLOAD_LOG = "CLEAR_UPLOAD_LOG";
export const SET_MESSAGE = "SET_MESSAGE";
export const CLEAR_MESSAGE = "CLEAR_MESSAGE";