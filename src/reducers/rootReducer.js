import { combineReducers } from "redux";

import imageListReducer, { getImageListConfig } from "./imageListReducer";
import channelReducer, { getChannelsConfig } from "./channelReducer";
import viewReducer from "./viewReducer";
import partReducer from "./partReducer";
import markerReducer from "./markerReducer";

const entityReducer = combineReducers({
    parts: partReducer,
    images: imageListReducer,
    markers: markerReducer,
});

export default combineReducers({
    channel: channelReducer,
    view: viewReducer,
    entities: entityReducer,
});

export const getConfig = (state) => ({
    images: getImageListConfig(state),
    channels: getChannelsConfig(state)
});