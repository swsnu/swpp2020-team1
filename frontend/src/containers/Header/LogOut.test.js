import React from 'react';
import LogOut from './LogOut';
import {  mount } from 'enzyme';
import { Provider } from 'react-redux';
import {  ConnectedRouter } from 'connected-react-router';
import { getMockStore } from '../../mock';
import { history } from '../../store/store';
import * as userActionCreators from '../../store/actions/user';

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

const mockStore = getMockStore(stubLoggedInState);

describe('Logout', ()=> {
    let logout,spyUserLogout, spyAlert
    beforeEach(() => {
        logout = (
            <Provider store = {mockStore}>
                <ConnectedRouter history={history} >
                    <LogOut/>
                 </ConnectedRouter>
            </Provider>
        )
        spyUserLogout = jest.spyOn(userActionCreators, 'logoutRequest').mockImplementation(() => { return dispatch => {}; });
        spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => { return () => {}; });
    }
    )
    afterEach(() => { jest.clearAllMocks() });
    
    it('should logout on button click' , () => {
        const spyHistoryPush = jest.spyOn(history, 'push')
        .mockImplementation(path => {});
        const component = mount(logout)
        const button = component.find('#logout button')
        button.simulate('click')
        
        expect(spyUserLogout).toBeCalledTimes(1)
        expect(spyHistoryPush).toBeCalledTimes(1)
    })
})