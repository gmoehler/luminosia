import { combineReducers } from 'redux';
import audioReducer from './audioReducer';
import selectionReducer from './selectionReducer';

export default combineReducers({
    audio: audioReducer,
    selection: selectionReducer
});
