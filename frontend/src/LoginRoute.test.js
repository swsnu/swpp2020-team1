import React from 'react';
import { Route, Switch } from 'react-router-dom'
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import LoginRoute from './LoginRoute';
import { getMockStore } from './mock'; 
import { history } from './store/store';
import * as userActionCreators from './store/actions/user';

const stubLoggedIn = {
  user:{
    login: {
      status: 'SUCCESS'
    },
    status: {
      valid: false,
      isLoggedIn: false,
      currentUser: ''
    }
  }
};

const stubNotLoggedIn = {
  user:{
    login: {
      status: 'FAILURE'
    },
    status: {
      valid: false,
      isLoggedIn: false,
      currentUser: ''
    }
  }
};

let mockStore = getMockStore(stubLoggedIn);
const mockLogin = () => {return <div id = 'login'>login</div>}
const mockMain = () => {return <div id = 'main'>main</div>}

describe('LoginRoute', () => {
  let mockApp;
  let spyLoginCheck;
  beforeEach(()=> {
    spyLoginCheck = jest.spyOn(userActionCreators, 'loginCheckRequest').mockImplementation(() => { 
      return dispatch => {};
    });
  });

  afterEach(() => { 
    jest.clearAllMocks() 
  });

  it('should call loginCheck() if user is not logged in', () => {
    mockStore = getMockStore(stubNotLoggedIn);
    mockApp = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path = '/login' exact component={mockLogin}/>
            <LoginRoute path = '/' exact component={mockMain}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    mount(mockApp);
    expect(spyLoginCheck).toBeCalledTimes(1);
  });

  it('should render mockMain if user is logged in', () => {
    mockStore = getMockStore(stubLoggedIn);
    mockApp = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path = '/login' exact component={mockLogin}/>
            <LoginRoute path = '/' exact component={mockMain}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    const component = mount(mockApp);
    expect(spyLoginCheck).toBeCalledTimes(0);
    expect(component.find('#main').length).toBe(1);
  });
});