// action type constants

// general actions
export const UPLOAD_CONFIG_STARTED = "UPLOAD_CONFIG_STARTED";
export const UPLOAD_CONFIG_SUCCESS = "UPLOAD_CONFIG_SUCCESS";
export const UPLOAD_CONFIG_FAILURE = "UPLOAD_CONFIG_FAILURE";

// channel actions
export const ADD_CHANNEL = "ADD_CHANNEL";
export const DELETE_CHANNEL = "DELETE_CHANNEL";
export const CLEAR_CHANNELS = "CLEAR_CHANNELS";
export const SELECT_CHANNEL = "SELECT_CHANNEL";
export const DESELECT_CHANNEL = "DESELECT_CHANNEL";

export const UPLOAD_AUDIO_STARTED = "UPLOAD_AUDIO_STARTED";
export const UPLOAD_AUDIO_SUCCESS = "UPLOAD_AUDIO_SUCCESS";
export const UPLOAD_AUDIO_FAILURE = "UPLOAD_AUDIO_FAILURE";

export const PLAY_CHANNELS = "PLAY_CHANNELS";
export const STOP_CHANNELS = "STOP_CHANNELS";
export const MOVE_CHANNEL = "MOVE_CHANNEL";
export const ADD_PART = "ADD_PART";
export const DELETE_PART = "DELETE_PART";

// image list actions
export const ADD_IMAGE = "ADD_IMAGE";
export const CLEAR_IMAGELIST = "CLEAR_IMAGELIST";
export const REMOVE_IMAGE = "REMOVE_IMAGE";

// view actions
export const CLEAR_VIEW = "CLEAR_VIEW";
export const SELECT = "SELECT";
export const SET_RESOLUTION = "SET_RESOLUTION";
export const SET_CHANNEL_PLAY_STATE = "SET_CHANNEL_PLAY_STATE";
export const SET_MARKER = "SET_MARKER";
export const DELETE_MARKER = "DELETE_MARKER";
export const UPDATE_MARKER = "UPDATE_MARKER";
export const SELECT_PART_OR_IMAGE = "SELECT_PART_OR_IMAGE";
export const DESELECT_PART_OR_IMAGE = "DESELECT_PART_OR_IMAGE";