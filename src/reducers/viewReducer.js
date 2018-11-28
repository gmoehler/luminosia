import {SELECT} from '../actions/types';

const initialState = {
  selection: {
    from: 0,
    to: 0
  }
};

export default(state = initialState, action) => {
  switch (action.type) {
    
    case SELECT:
      return {
        ...state,
        selection: {
          from: action.payload.from,
          to: action.payload.to
        }
      };

    default:
      return state
  }
}

export const getSelectionRange = (state) => {
  return { 
	from: state.view.selection.from,
	to: state.view.selection.to,
	}
}

