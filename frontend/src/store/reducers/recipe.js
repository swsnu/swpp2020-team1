import * as actionTypes from '../actions/actionTypes';

const initialState = {
  recipes: [],
  selectedRecipe: null,
  ratedRecipes: [],
  searchResults: [],
}

const recipeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RECIPES:
      return {...state, recipes: action.recipes};
    case actionTypes.SEARCH_RECIPES:
      return {...state, searchResults: action.searchResults}
    case actionTypes.GET_RECIPE:
      return {...state, selectedRecipe: action.recipe };
    case actionTypes.PUT_RECIPE:
      return {...state, 
        recipes: state.recipes.map(r => {
          if (r.id === action.recipe.id) return action.recipe;
          else return r;
        }),
        selectedRecipe: action.recipe,
        searchResults: state.searchResults.map(r => {
          if(r.id === action.recipe.id) {
            r.rating_average = action.recipe.rating_average
          }
          return r;
        }),
        ratedRecipes: state.ratedRecipes.concat(action.recipe.id)
      };
    case actionTypes.GET_RATED_RECIPES:
      return {...state, ratedRecipes: action.recipeIds};      
    default:
      break;
  }
  return state;
}

export default recipeReducer;