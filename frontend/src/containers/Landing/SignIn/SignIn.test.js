import React from 'react';
import SignIn from './SignIn';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Redirect } from 'react-router-dom';
import { getMockStore } from '../../../mock';
import { history } from '../../../store/store';
import * as userActionCreators from '../../../store/actions/user';
import * as actionTypes from '../../../store/actions/actionTypes'

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

describe('SignIn', ()=> {
    let mockLogin, spyUserLogin
    beforeEach(() => {
      mockLogin = (
        <Provider store={mockStore}>
          <ConnectedRouter history={history}>
            <SignIn />
          </ConnectedRouter>
        </Provider>
      );
      spyUserLogin = jest.spyOn(userActionCreators, 'loginRequest').mockImplementation(() => { 
        return dispatch => {}; 
      });
    })
    afterEach(() => { jest.clearAllMocks() });

    it('should render Login', () => {
      const component = mount(mockLogin);
      expect(component.find('.SignIn').length).toBe(1);
    })

    it('should redirect to MainPage on login Success', () => { 
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
        }
      };
      const loggedInMockStore = getMockStore(stubLoggedInState);
      const loggedInComponent = mount(
        <Provider store = {loggedInMockStore}>
          <ConnectedRouter history={history}>
            <SignIn />
          </ConnectedRouter>
        </Provider>
      );
      expect(loggedInComponent.find(Redirect).length).toBe(1);
    })

    it('should not login on login Failure' , () => {
      mockStore.dispatch({type : actionTypes.LOGIN_FAILURE})
      const component = mount(mockLogin)
      expect(component.find('.SignIn').length).toBe(1);
    })

    it('should redirect to SignUp page on clicking sign-up button' , () => {
      const spyHistoryPush = jest.spyOn(history, 'push')
        .mockImplementation(path => {});
      const component = mount(mockLogin)
      const wrapperButton = component.find({id: 'sign-up'}).find('a').at(0);
      wrapperButton.simulate('click');
      expect(spyHistoryPush).toBeCalledTimes(1)
    })

    it('should login when valid username & password is given', ()=>{
      const dispatch = jest.fn();
      const component = mount(mockLogin);
      const wrapperEmail = component.find({ id: 'email' }).at(1);
      const wrapperPW = component.find({ id: 'password' }).at(1);
      wrapperEmail.props().onChange({ target: { value: 'valid@snu.ac.kr' } });
      wrapperPW.props().onChange({ target: { value: 'valid123' } });
      const wrapperButton = component.find({ id: 'login-button' }).find('button').at(0);
      wrapperButton.simulate('click');
      expect(spyUserLogin).toHaveBeenCalledTimes(1);
   });
  })