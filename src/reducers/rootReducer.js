import { combineReducers } from 'redux';
import audioReducer from './audioReducer';
import playReducer from './playReducer';

export default combineReducers({
    audio: audioReducer,
    play: playReducer
});
