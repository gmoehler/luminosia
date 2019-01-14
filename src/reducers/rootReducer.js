import { combineReducers } from 'redux';

import channelReducer,  { getChannelsConfig } from './channelReducer';
import viewReducer from './viewReducer';
import imageListReducer,  { getImageListConfig } from './imageListReducer';

export default combineReducers({
    channel: channelReducer,
    images: imageListReducer,
    view: viewReducer
});

export const getConfig = (state) => ({
    images: getImageListConfig(state), 
    channels: getChannelsConfig(state)
})