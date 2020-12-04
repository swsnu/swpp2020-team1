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

  const getMockUserReducer = jest.fn(
    initialState => (state = initialState, action) => { 
      switch(action.type) {
            case actionTypes.SIGN_UP:
              return {
                ...state,
                register: {
                  status: 'WAITING',
                  error: -1
                }
              }
            case actionTypes.SIGN_UP_SUCCESS:
              return {
                ...state,
                register: {
                  ...state.register,
                  status: 'SUCCESS'
                }
              }
            case actionTypes.SIGN_UP_FAILURE:
              return {
                ...state,
                register:{
                  status: 'FAILURE',
                  error: action.error
                }
              }
            case  actionTypes.LOGIN:
              return {
                ...state,
                login : {
                  status: 'WAITING'
                }
              }
          case actionTypes.LOGIN_SUCCESS:
              return {
                ...state,
                login: {
                    status: 'SUCCESS'
                },
                status: {
                  ...state.status,
                  isLoggedIn: true,
                  currentUser: action.username
                }
              }
          case actionTypes.LOGIN_FAILURE:
              return {
                ...state,
                login:{
                  status: 'FAILURE'
                }
              }
            case actionTypes.LOGOUT:
              return {
                ...state,
                login : { status : 'INIT'},
                status : {
                  ...state.status,
                  isLoggedIn : false,
                  currentUser : ''
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
  const mockUserReducer = getMockUserReducer(initial.user || null);
  
  const rootReducer = combineReducers({
    article: mockArticleReducer,
    category: mockCategoryReducer,
    item: mockItemReducer,
    itemcount: mockItemCountReducer,
    notification: mockNotiReducer,
    recipe: mockRecipeReducer,
    comment: mockCommentReducer,
    user : mockUserReducer,
    router: connectRouter(history)
  });

  const mockStore = createStore(rootReducer, applyMiddleware(thunk));
  return mockStore;
}