import * as actionTypes from '../actions/actionTypes';

const initialState = {
  articles: [],
  selectedArticle: []
}

const articleReducer = (state = initialState, action)=>{
  switch(action.type){
    case actionTypes.GET_ARTICLE:
      return {...state, selectedArticle: action.target};
    case actionTypes.GET_ALL:
      return {...state, articles: action.articles };
    default:
      break;
  }
  return state;
}

export default articleReducer;