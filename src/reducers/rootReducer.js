import { combineReducers } from "redux";

import imageListReducer, { getImageListConfig } from "./imageListReducer";
import channelReducer, { getChannelsConfig } from "./channelReducer";
import viewReducer from "./viewReducer";

export default combineReducers({
    images: imageListReducer,
    channel: channelReducer,
    view: viewReducer
});

export const getConfig = (state) => ({
    images: getImageListConfig(state),
    channels: getChannelsConfig(state)
});