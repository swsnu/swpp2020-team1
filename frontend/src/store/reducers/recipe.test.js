import recipeReducer from "./recipe";
import * as actionTypes from '../actions/actionTypes';

let stubRecipes = [
  {
    id: 1, 
    title: "r1", 
    description: "d1", 
    video_url: "u1", 
    cuisine_type: "korean", 
    ingredients: [1], 
    rating_average: 3.5,
  },
  {
    id: 2, 
    title: "r2", 
    description: "d2", 
    video_url: "u2", 
    cuisine_type: "korean", 
    ingredients: [1,2], 
    rating_average: 3.0,
  },
]

const stubInitialState = {
  recipes: stubRecipes,
  selectedRecipe: null,
  ratedRecipes: [1],
  searchResults: stubRecipes,
}

describe('recipe reducer', () => {
  it('should return initial state', () => {
    const initialState = recipeReducer(undefined, {}); 
    expect(initialState).toEqual({
      recipes: [],
      selectedRecipe: null,
      ratedRecipes: [],
      searchResults: [],
    });
  });

  it('should get all recipes', () => {
    const updateState = recipeReducer(undefined, {
      type: actionTypes.GET_RECIPES, 
      recipes: stubRecipes
    }); 
    expect(updateState.recipes).toEqual(stubRecipes);
  })

  it('should search recipe', () => {
    let searchResults = [];
    const updateState = recipeReducer(undefined, {
      type: actionTypes.SEARCH_RECIPES, 
      searchResults: searchResults 
    }); 
    expect(updateState.searchResults).toEqual(searchResults);
  })

  it('should get recipe', () => {
    let recipe = {};
    const updateState = recipeReducer(undefined, {
      type: actionTypes.GET_RECIPE, 
      recipe: recipe 
    }); 
    expect(updateState.selectedRecipe).toEqual(recipe);
  })


  it('should put recipe (give rating)', () => {
    const updateState = recipeReducer(stubInitialState, {
      type: actionTypes.PUT_RECIPE,
      recipe: {id:1, rating_average: 5.0}
    });
    expect(updateState.selectedRecipe.rating_average).toEqual(5.0);
  })

  it('should get rated recipes', () => {
    let ratedRecipes = [1,2,3]
    const updateState = recipeReducer(undefined, {
      type: actionTypes.GET_RATED_RECIPES,
      recipeIds: ratedRecipes
    });
    expect(updateState.ratedRecipes).toEqual(ratedRecipes);
  })

});