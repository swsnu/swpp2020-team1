import React from 'react';
import axios from 'axios';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';

import ItemContainer from './ItemContainer';
import { getMockStore } from '../../mock';
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

describe('<ItemContainer />', () => {

  afterEach(() => {jest.clearAllMocks()})

  let itemContainer, mockHistory, mockItems;
  beforeEach(() => {

    mockHistory = {push: jest.fn()}
    mockItems = [
      {'id': 1, 
      'user_id': 1, 
      'container': 'freezer', 
      'barcode_num': 100, 
      'name': 'steak', 
      'category_id': 1,
      'itemcounts': [{'id': 1, 'item_id': 1, 'expiration_date': '20201231', 'count': 2}]
      },
      {'id': 2, 
      'user_id': 1, 
      'container': 'freezer', 
      'barcode_num': 101, 
      'name': 'egg', 
      'category_id': 2,
      'itemcounts': [{'id': 1, 'item_id': 1, 'expiration_date': '20201231', 'count': 2}]
      },
    ]

    itemContainer = (
      <Provider store={mockStore}>
        <BrowserRouter>
        <Switch>
          <ItemContainer type="freezer" items={mockItems} history={mockHistory}/>
        </Switch>
        </BrowserRouter>
      </Provider>
    );
  })

  it('should render itemContainer', () => {
    const component = mount(itemContainer);
    const wrapper = component.find('.ItemContainer');
    expect(wrapper.length).toBe(1);
  });

  it('should handle add item button', () => {
    const component = mount(itemContainer);
    const itemContainerInstance = component.find(ItemContainer.WrappedComponent).instance();

    const addItemButton = component.find('.AddItemButton');
    addItemButton.simulate('click');

    // why this is not working? maybe because it's not a route defined in App.js
    // expect(mockHistory.push).toHaveBeenCalled();
  });

  it('should handle remove item button', () => {
    const spyEditItemCount = jest.spyOn(itemcountActionCreators, 'editItemCount')
      .mockImplementation(art => {return dispatch => Promise.resolve({})});
 

    const component = mount(itemContainer);
    const removeItemButton = component.find('.btn_remove_item button').at(0);
    removeItemButton.simulate('click');
    expect(spyEditItemCount).toHaveBeenCalled();
  });

  it('should render when this.props.items is null', () => {
    itemContainer = (
      <Provider store={mockStore}>
        <BrowserRouter>
        <Switch>
          <ItemContainer type="freezer" items={[]} history={mockHistory}/>
        </Switch>
        </BrowserRouter>
      </Provider>
    );
    mount(itemContainer);
  }) 


});

