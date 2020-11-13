import React from 'react';
import axios from 'axios';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch, BrowserRouter, MemoryRouter } from 'react-router-dom';

import MainPage from './MainPage';
import store from '../../store/store';
import * as itemActionCreators from '../../store/actions/item';
import * as itemcountActionCreators from '../../store/actions/itemcount';

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

const stubInitialState = {
  item: {
    items: [],
  },
  itemcount: {
    itemcounts: [],
  }
};

// const mockStore = getMockStore(stubInitialState);

describe('<MainPage />', () => {

  afterEach(() => {jest.clearAllMocks()})

  let mainPage, mockHistory;
  beforeEach(() => {
    mockHistory = {push: jest.fn()}
    mainPage = (
      <Provider store={store}>
        <MemoryRouter>
        <Switch>
          <Route path='/' exact render={() => <MainPage history={mockHistory}/>} />
        </Switch>
        </MemoryRouter>
      </Provider>
    );

  })


  it('should render mainPage', () => {
    console.log(store);
    console.log(mainPage);
    const component = mount(mainPage);
    const wrapper = component.find('.MainPage');
    console.log(wrapper)
    expect(wrapper.length).toBe(1);

  });


  // it('should handle createArticle', async () => {
  //   const spyCreateArticle = jest.spyOn(articleActionCreators, 'createArticle')
  //     .mockImplementation(art => {return dispatch => Promise.resolve({article:art})});
  //   const component = mount(mainPage);
  //   const mainPageInstance = component.find(MainPage.WrappedComponent).instance();

  //   const title = component.find('#article-title-input');
  //   title.simulate('change', { target: { value: 'title' } });
  //   expect(mainPageInstance.state.title).toEqual('title');
  //   const content = component.find('#article-content-input');
  //   content.simulate('change', { target: { value: 'content' } });
  //   expect(mainPageInstance.state.content).toEqual('content');

  //   const createButton = component.find('#confirm-create-article-button');
  //   createButton.simulate('click');
  //   await flushPromises();
  //   expect(spyCreateArticle).toHaveBeenCalled();
  //   expect(mockHistory.push).toHaveBeenCalled();
  // })

  // it('should handle tab buttons', () => {
  //   const component = mount(mainPage);
  //   const mainPageInstance = component.find(MainPage.WrappedComponent).instance();

  //   const previewTabButton = component.find('#preview-tab-button');
  //   previewTabButton.simulate('click');
  //   expect(mainPageInstance.state.write).toBe(false);

  //   const writeTabButton = component.find('#write-tab-button');
  //   writeTabButton.simulate('click');
  //   expect(mainPageInstance.state.write).toBe(true);
  // })


  // it('should handle back button', () => {
  //   const component = mount(mainPage);
  //   const backButton = component.find('#back-create-article-button');
  //   backButton.simulate('click');
  //   expect(mockHistory.push).toHaveBeenCalled();
  // })

  // it('should handle logout', async () => {
  //   const spyUpdateUser = jest.spyOn(userActionCreators, 'updateUser')
  //     .mockImplementation(user => {return dispatch => Promise.resolve()});
  //   const component = mount(mainPage);
  //   const logoutButton = component.find('#logout-button');
  //   logoutButton.simulate('click');
  //   await flushPromises();
  //   expect(spyUpdateUser).toHaveBeenCalled();
  // })

});

