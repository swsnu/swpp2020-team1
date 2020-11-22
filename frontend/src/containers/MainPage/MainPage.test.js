import React from 'react';
import axios from 'axios';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';

import MainPage from './MainPage';
import { getMockStore } from '../../mock';
import * as itemActionCreators from '../../store/actions/item';
import * as itemcountActionCreators from '../../store/actions/itemcount';

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

const stubInitialState = {
  item: {
    items: [  
      {'id': 1, 'user_id': 2, 'container': 'freezer', 'barcode_num': 100, 'name': 'steak', 'category_id': 1},
      {'id': 2, 'user_id': 2, 'container': 'freezer', 'barcode_num': 101, 'name': 'chicken', 'category_id': 2},
      {'id': 3, 'user_id': 2, 'container': 'freezer', 'barcode_num': 102, 'name': 'egg', 'category_id': 3},
      {'id': 4, 'user_id': 2, 'container': 'fridge', 'barcode_num': 103, 'name': 'kimchi', 'category_id': 4},
      {'id': 5, 'user_id': 2, 'container': 'shelf', 'barcode_num': 104, 'name': 'par', 'category_id': 5},
      {'id': 6, 'user_id': 2, 'container': 'shelf', 'barcode_num': 105, 'name': 'apple', 'category_id': 6},
      {'id': 7, 'user_id': 2, 'container': 'shelf', 'barcode_num': 106, 'name': 'bread', 'category_id': 7},
  ],
  },
  itemcount: {
    itemcounts: [
      {'id': 1, 'item_id': 1, 'expiration_date': '20201231', 'count': 2},
      {'id': 2, 'item_id': 1, 'expiration_date': '20201231', 'count': 1},
      {'id': 3, 'item_id': 2, 'expiration_date': '20201231', 'count': 3},
      {'id': 4, 'item_id': 3, 'expiration_date': '20201231', 'count': 1},
      {'id': 5, 'item_id': 4, 'expiration_date': '20201231', 'count': 1},
    ],
  },
  article: {
    articles: [],
    selectedArticle: []
  },
  notification: {
    notifications: []
  }
};

const mockStore = getMockStore(stubInitialState);

describe('<MainPage />', () => {

  afterEach(() => {jest.clearAllMocks()})

  let mainPage, mockHistory;
  beforeEach(() => {
    mockHistory = {push: jest.fn()}
    mainPage = (
      <Provider store={mockStore}>
        <BrowserRouter>
        <Switch>
          <Route path='/' exact render={() => <MainPage history={mockHistory}/>} />
        </Switch>
        </BrowserRouter>
      </Provider>
    );

  })


  it('should render mainPage', async () => {
    const spyPost = jest.spyOn(axios, 'post')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          resolve();
        })
      })
    const spyGet = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          resolve({data: []});
        })
      })
    const component = mount(mainPage);
    const wrapper = component.find('.MainPage');
    expect(wrapper.length).toBe(1);

    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    await flushPromises();
  });

  it('should handle notification button', async () => {
    const spyPost = jest.spyOn(axios, 'post')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          resolve();
        })
      })
    const spyGet = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          resolve({data: []});
        })
      })
    const component = mount(mainPage);
    const notiButton = component.find('.btn_notification');
    await flushPromises();
    notiButton.simulate('click');
  });

});

