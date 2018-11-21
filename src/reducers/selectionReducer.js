import {SELECT} from '../actions/types';

const initialState = {
  from: 0,
  to: 0
};

export default(state = initialState, action) => {
  switch (action.type) {
    
    case SELECT:
      return {
        ...state,
        from: action.payload.from,
        to: action.payload.to
      };

    default:
      return state
  }
}

export const getSelectionRange = (state) => {
  return { 
	from: state.selection.from,
	to: state.selection.to,
	}
}

