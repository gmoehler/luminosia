import {LOAD_AUDIO_STARTED, 
        LOAD_AUDIO_FAILURE, 
        LOAD_AUDIO_SUCCESS} from './types';
import extractPeaks from 'webaudio-peaks';

import LoaderFactory from '../loader/LoaderFactory'

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
                const peaks = extractPeaks(audioBuffer)
                dispatch(loadAudioSuccess({audioBuffer, peaks}));
        })
        .catch(err => {
            dispatch(loadAudioFailure(err));
        });
    };
};




