import { combineReducers } from "redux";

import channelReducer, { getChannelsConfig } from "./channelReducer";
import viewReducer from "./viewReducer";
import entityReducer from "./entityReducer";
import { getImageListConfig } from "./imageListReducer";


export default combineReducers({
    channel: channelReducer,
    view: viewReducer,
    entities: entityReducer,
});

export const getConfig = (state) => ({
    images: getImageListConfig(state),
    channels: getChannelsConfig(state)
});