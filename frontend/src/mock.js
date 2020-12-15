import thunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router'; 
import * as actionTypes from './store/actions/actionTypes';

const history = createBrowserHistory();

export const getMockStore = initial => {
  const getMockArticleReducer = jest.fn(
    initialState => (state=initialState, action) => {
      switch(action.type){
        default:
          return state;
      }
    }
  );

  const getMockCategoryReducer = jest.fn(
    initialState => (state=initialState, action) => {
      switch(action.type){
        default:
          return state;
      }
    }    
  );
  
  const getMockItemReducer = jest.fn(
    initialState => (state=initialState, action) => {
      switch(action.type){
        default:
          return state;
      }
    }
  );
  
  const getMockItemCountReducer = jest.fn(
    initialState => (state=initialState, action) => {
      switch(action.type){
        default:
          return state;
      }
    }
  );

  const getMockNotiReducer = jest.fn(
    initialState => (state=initialState, action) => {
      switch(action.type){
        default:
          return state;
      }
    }
  );

  const getMockRecipeReducer = jest.fn(
    initialState => (state=initialState, action) => {
      switch(action.type){
        default:
          return state;
      }
    }
  );

  const getMockCommentReducer = jest.fn(
    initialState => (state=initialState, action) => {
      switch(action.type){
        default:
          return state;
      }
    }    
  );

  const getMockAddItemReducer = jest.fn(
    initialState => (state=initialState, action) => {
      switch(action.type) {
        default:
          return state;
      }
    }    
  );

  const getMockUserReducer = jest.fn(
    initialState => (state = initialState, action) => { 
      switch(action.type) {
        case actionTypes.LOGIN_FAILURE:
          return {
            ...state,
            login:{
              status: 'FAILURE'
            }
          }
        default:
          break;
      }
      return state;
    }
  );

  const mockArticleReducer = getMockArticleReducer(initial.article || null);
  const mockCategoryReducer = getMockCategoryReducer(initial.category || null);
  const mockItemReducer = getMockItemReducer(initial.item || null);
  const mockItemCountReducer = getMockItemCountReducer(initial.itemcount || null);
  const mockNotiReducer = getMockNotiReducer(initial.notification || null);
  const mockRecipeReducer = getMockRecipeReducer(initial.recipe || null);
  const mockCommentReducer = getMockCommentReducer(initial.comment || null);
  const mockAddItemReducer = getMockAddItemReducer(initial.additem || null);
  const mockUserReducer = getMockUserReducer(initial.user || null);
  
  const rootReducer = combineReducers({
    article: mockArticleReducer,
    category: mockCategoryReducer,
    item: mockItemReducer,
    itemcount: mockItemCountReducer,
    notification: mockNotiReducer,
    recipe: mockRecipeReducer,
    comment: mockCommentReducer,
    additem: mockAddItemReducer,
    user : mockUserReducer,
    router: connectRouter(history)
  });

  const mockStore = createStore(rootReducer, applyMiddleware(thunk));
  return mockStore;
}