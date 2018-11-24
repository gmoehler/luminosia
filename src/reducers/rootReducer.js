import { combineReducers } from 'redux';
import audioReducer from './audioReducer';
import selectionReducer from './selectionReducer';

export default combineReducers({
    channels: audioReducer,
    selection: selectionReducer
});
