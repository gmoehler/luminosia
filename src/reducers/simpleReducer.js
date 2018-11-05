import {ADD_TODO_SUCCESS, ADD_TODO_FAILURE, ADD_TODO_STARTED, DELETE_TODO} from '../actions/types';

const initialState = {
  loading: false,
  todos: [],
  error: null
};

export default(state = initialState, action) => {
  switch (action.type) {
    case 'SIMPLE_ACTION':
      return {result: action.payload}
    case ADD_TODO_STARTED:
      return {
        ...state,
        loading: true
      };
    case ADD_TODO_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        todos: [
          ...state.todos,
          action.payload
        ]
      };
    case ADD_TODO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    default:
      return state
  }
}
