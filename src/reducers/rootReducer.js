import { combineReducers } from 'redux';
import channelReducer from './channelReducer';
import selectionReducer from './selectionReducer';

export default combineReducers({
    channel: channelReducer,
    selection: selectionReducer
});
