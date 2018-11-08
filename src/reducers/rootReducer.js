import { combineReducers } from 'redux';
import simpleReducer from './simpleReducer';
import loadAudioReducer from './loadAudioReducer';

export default combineReducers({
    audio: loadAudioReducer,
    simpleReducer
});
