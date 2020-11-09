import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import articleReducer from './reducers/article';
import itemReducer from './reducers/item';
import itemcountReducer from './reducers/itemcount';

import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  article: articleReducer,
  item: itemReducer,
  itemcount: itemcountReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;