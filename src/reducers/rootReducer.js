import { combineReducers } from 'redux';
import audioReducer from './audioReducer';

export default combineReducers({
    audio: audioReducer
});
