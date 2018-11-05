import {ADD_TODO_SUCCESS, ADD_TODO_FAILURE, ADD_TODO_STARTED, DELETE_TODO} from './types';

export const simpleAction = () => dispatch => {
    dispatch({type: 'SIMPLE_ACTION', payload: 'result_of_simple_action'})
}

export const addTodo = ({title, userId}) => {
    return dispatch => {
        dispatch(addTodoStarted());

        postTodo(title, userId)
        .then(data => {
            setTimeout(() => {
                dispatch(addTodoSuccess(data));
            }, 1000);
        })
        .catch(err => {
            dispatch(addTodoFailure(err.message));
        });
    };
};

function postTodo(title, userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Posting todos");
            resolve(title + " from " + userId);
        }, 1000);
    })
};

const addTodoSuccess = todo => ({
    type: ADD_TODO_SUCCESS,
    payload: {
        todo
    }
});

const addTodoStarted = () => ({type: ADD_TODO_STARTED});

const addTodoFailure = error => ({type: ADD_TODO_FAILURE, payload: {
        error
    }});