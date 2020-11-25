import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import articleReducer from './reducers/article';
import itemReducer from './reducers/item';
import itemcountReducer from './reducers/itemcount';
import notiReducer from './reducers/notification';
import categoryReducer from './reducers/category';
import recipeReducer from './reducers/recipe';

import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  article: articleReducer,
  item: itemReducer,
  itemcount: itemcountReducer,
  notification: notiReducer,
  category: categoryReducer,
  recipe: recipeReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;