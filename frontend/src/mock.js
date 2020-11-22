import thunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router'; 

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

  const mockArticleReducer = getMockArticleReducer(initial.article);
  const mockItemReducer = getMockItemReducer(initial.item);
  const mockItemCountReducer = getMockItemCountReducer(initial.itemcount);
  const mockNotiReducer = getMockNotiReducer(initial.notification);
  
  const rootReducer = combineReducers({
    article: mockArticleReducer,
    item: mockItemReducer,
    itemcount: mockItemCountReducer,
    notification: mockNotiReducer,
    router: connectRouter(history)
  });

  const mockStore = createStore(rootReducer,applyMiddleware(thunk));
  return mockStore;
}