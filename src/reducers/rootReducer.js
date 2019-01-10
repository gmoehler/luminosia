import { combineReducers } from 'redux';

import channelReducer from './channelReducer';
import viewReducer from './viewReducer';
import imageListReducer from './imageListReducer';

export default combineReducers({
    channel: channelReducer,
    images: imageListReducer,
    view: viewReducer
});
