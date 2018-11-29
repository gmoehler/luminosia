import { combineReducers } from 'redux';
import channelReducer from './channelReducer';
import viewReducer from './viewReducer';

export default combineReducers({
    channel: channelReducer,
    view: viewReducer
});
