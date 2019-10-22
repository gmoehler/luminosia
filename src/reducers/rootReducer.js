import { combineReducers } from "redux";

import { getChannelsConfig } from "./channelReducer";
import viewReducer from "./viewReducer";
import entityReducer from "./entityReducer";
import { getImageListConfig } from "./imageListReducer";


export default combineReducers({
    view: viewReducer,
    entities: entityReducer,
});

export const getConfig = (state) => ({
    images: getImageListConfig(state),
    channels: getChannelsConfig(state)
});