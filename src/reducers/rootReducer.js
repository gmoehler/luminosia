import { combineReducers } from 'redux';
import audioReducer from './audioReducer';
import playReducer from './playReducer';
import selectionReducer from './selectionReducer';

export default combineReducers({
    audio: audioReducer,
    play: playReducer,
    selection: selectionReducer
});
