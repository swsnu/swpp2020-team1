import * as actionTypes from '../actions/actionTypes';

const initialState = {
  categories: []
}

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_CATEGORIES:
      return {...state, categories: action.categories };
    default:
      break;
  }
  return state;
}

export default categoryReducer;