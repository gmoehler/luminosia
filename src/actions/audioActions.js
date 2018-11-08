import extractPeaks from 'webaudio-peaks';
import LoaderFactory from '../loader/LoaderFactory'

import {
    LOAD_AUDIO_STARTED, 
    LOAD_AUDIO_FAILURE, 
    LOAD_AUDIO_SUCCESS,
    PLAY_AUDIO_STARTED,
    PLAY_AUDIO_STOPPED,
    SET_PLAY_TIME
    } from './types';

// load audio async action

const loadAudioStarted = () => ({
    type: LOAD_AUDIO_STARTED
});


const loadAudioSuccess = audioBuffer => ({
    type: LOAD_AUDIO_SUCCESS,
    payload: {
        audioBuffer
    }
});

const loadAudioFailure = error => ({
    type: LOAD_AUDIO_FAILURE, 
    payload: {
        error
    }
});

function loadAudioFromFile(audioSource, audioContext) {
    const loader = LoaderFactory.createLoader(audioSource, audioContext);
    return loader.load();
};

export const loadAudio = ({audioSource, audioContext}) => {
    return dispatch => {
        dispatch(loadAudioStarted());

        loadAudioFromFile(audioSource, audioContext)
        .then(audioBuffer => {
                const peaks = extractPeaks(audioBuffer, 1000, true, 0, audioBuffer.length, 16);
                dispatch(loadAudioSuccess({audioBuffer, peaks}));
        })
        .catch(err => {
            dispatch(loadAudioFailure(err));
        });
    };
};


// play audio async action

const playAudioStarted = () => ({
    type: PLAY_AUDIO_STARTED
});

const playAudioStopped = () => ({
    type: PLAY_AUDIO_STARTED
});


export const playAudio = spec => {
    return (dispatch, getState) => {
        dispatch(playAudioStarted());

        const asource = spec.audioContext.createBufferSource();
        asource.buffer = getState().audio.audioBuffer;
        asource.connect(spec.audioContext.destination);
        asource.start(0, 0, 2);
    };
};
