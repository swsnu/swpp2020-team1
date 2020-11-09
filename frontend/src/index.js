import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
<<<<<<< HEAD
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import articleReducer from './store/reducers/article';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router'; 
import { createBrowserHistory } from 'history';
import itemReducer from './store/reducers/item';
import itemcountReducer from './store/reducers/itemcount';


const history = createBrowserHistory();
const rootReducer = combineReducers({
  item: itemReducer,
  itemcount: itemcountReducer,
  article: articleReducer,
  router: connectRouter(history)
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, routerMiddleware(history))));

ReactDOM.render(<Provider store={store}>
  <App history={history} />
=======
import store from './store/store';


ReactDOM.render(
  <Provider store={store}>
    <App />
>>>>>>> master
  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
