import * as actionTypes from '../actions/actionTypes';

const initialState = {
  recipes: [],
  ratedRecipes: [],
}

const recipeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RECIPES:
      return {...state, recipes: action.recipes};
    case actionTypes.GET_RECIPE:
      return {...state, recipes: state.recipes.map(r => {
        if (r.id === action.recipe.id) return action.recipe
        else return r
      })};
    case actionTypes.PUT_RECIPE:
      return {...state, recipes: state.recipes.map(r => {
        if (r.id === action.recipe.id) return action.recipe
        else return r
      })};
    case actionTypes.GET_RATED_RECIPES:
      return {...state, ratedRecipes: action.recipeIds};      
    default:
      break;
  }
  return state;
}

export default recipeReducer;