import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Redirect } from 'react-router-dom';

import SignUp from './SignUp';
import { getMockStore } from '../../../mock';
import { history } from '../../../store/store';
import * as userActionCreators from '../../../store/actions/user';

const stubInitialState = {
  item: {
    items: [],
  },
  itemcount: {
    itemcounts: [],
  },
  article: {
    articles: [],
    selectedArticle: []
  },
  notification: {
    notifications: []
  },
  recipe: {
    recipes: []
  },
  user:{
    login: {
      status: 'INIT'
    },
    register: {
        status: 'INIT',
        error: -1
    },
    status: {
        valid: false,
        isLoggedIn: false,
        currentUser: ''
    }
  }
};

const mockStore = getMockStore(stubInitialState);

describe('Signup', () => {
  let mockSignup;
  let spyOnSignupUser;
  beforeEach(() => {
    spyOnSignupUser = jest.spyOn(userActionCreators, 'signUpRequest').mockImplementation(() => { 
      return dispatch => {}; 
    });
    mockSignup = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <SignUp />
        </ConnectedRouter>
      </Provider>
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Signup', () => {
    const component = mount(mockSignup);
    expect(component.find('.Signup').length).toBe(1);
  });

  it('should accept signup', () => {
    const component = mount(mockSignup);

    const wrapperEmail = component.find({ id: 'email' }).at(1);
    const wrapperPW = component.find({ id: 'password' }).at(1);
    const wrapperPWConfirm = component.find({ id: 'password-confirmation' }).at(1);
    const wrapperName = component.find({ id: 'name' }).at(1);

    wrapperEmail.props().onChange({ target: { value: 'swpp@snu.com' } });
    wrapperPW.props().onChange({ target: { value: 'Password123*' } });
    wrapperPWConfirm.props().onChange({ target: { value: 'Password123*' } });
    wrapperName.props().onChange({ target: { value: 'Peter' } });

    const wrapperButton = component.find({ id: 'signup-button' }).find('button').at(0);
    wrapperButton.simulate('click');

    expect(spyOnSignupUser).toHaveBeenCalledTimes(1);
  });

  it('should NOT accept signup', () => {
    const component = mount(mockSignup);
    const wrapperEmail = component.find({ id: 'email' }).at(1);
    const wrapperPW = component.find({ id: 'password' }).at(1);
    const wrapperPWConfirm = component.find({ id: 'password-confirmation' }).at(1);
    const wrapperName = component.find({ id: 'name' }).at(1);
    const wrapperButton = component.find({ id: 'signup-button' }).find('button').at(0);

    wrapperEmail.props().onChange({ target: { value: 'swppsnu.com' } });
    wrapperPW.props().onChange({ target: { value: 'Password123*' } });
    wrapperPWConfirm.props().onChange({ target: { value: 'password123*' } });
    wrapperName.props().onChange({ target: { value: 'peter' } });
    wrapperButton.simulate('click');
    expect(spyOnSignupUser).toHaveBeenCalledTimes(0);
  });
  
  it('should NOT accept signup 2', () => {
    const component = mount(mockSignup);

    const wrapperEmail = component.find({ id: 'email' }).at(1);
    const wrapperPW = component.find({ id: 'password' }).at(1);
    const wrapperPWConfirm = component.find({ id: 'password-confirmation' }).at(1);
    const wrapperName = component.find({ id: 'name' }).at(1);
    const wrapperButton = component.find({ id: 'signup-button' }).find('button').at(0);

    wrapperEmail.props().onChange({ target: { value: 'swppsnu.com' } });
    wrapperPW.props().onChange({ target: { value: 'pwd*' } });
    wrapperPWConfirm.props().onChange({ target: { value: 'pwd*' } });
    wrapperName.props().onChange({ target: { value: 'peter' } });
    wrapperButton.simulate('click');

    expect(spyOnSignupUser).toHaveBeenCalledTimes(0);
  });

  it('should redirect to MainPage when logged in', () => { 
    const stubLoggedInState = {
      item: {
        items: [],
      },
      itemcount: {
        itemcounts: [],
      },
      article: {
        articles: [],
        selectedArticle: []
      },
      notification: {
        notifications: []
      },
      recipe: {
        recipes: []
      },
      user:{
        login: {
          status: 'SUCCESS'
        },
        register: {
          status: 'SUCCESS',
          error: -1
        },
        status: {
            valid: false,
            isLoggedIn: false,
            currentUser: ''
        }
      }
    };
    const loggedInMockStore = getMockStore(stubLoggedInState);
    const loggedInComponent = mount(
      <Provider store = {loggedInMockStore}>
        <ConnectedRouter history={history}>
          <SignUp />
        </ConnectedRouter>
      </Provider>
    );
    expect(loggedInComponent.find(Redirect).length).toBe(1);
  })
});