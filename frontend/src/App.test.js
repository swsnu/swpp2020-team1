import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/store';
import { PersistGate } from 'redux-persist/integration/react';	
import { persistStore } from 'redux-persist';
import { createMemoryHistory } from 'history';


it('renders without crashing', () => {
  const div = document.createElement('div');
  const persistor = persistStore(store);
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
