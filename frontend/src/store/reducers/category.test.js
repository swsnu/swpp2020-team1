import categoryReducer from "./category";
import * as actionTypes from '../actions/actionTypes';

let stubCategories = [
  {"id": 1, "name": "milk"},
  {"id": 2, "name": "aa"},
]

const stubInitialState = {
  categories: [],
}

describe('category reducer', () => {
  it('should return initial state', () => {
    const initialState = categoryReducer(undefined, {}); 
    expect(initialState).toEqual({
      categories: [],
    });
  });

  it('should get all user categories', () => {
    const updateState = categoryReducer(undefined, {
      type: actionTypes.GET_CATEGORIES, 
      categories: stubCategories
    });
    expect(updateState.categories).toEqual(stubCategories);
  })
});