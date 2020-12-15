import React from 'react';
import axios from 'axios';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';

import ItemConfirm from './ItemConfirm';
import { getMockStore } from '../../mock';
import EditItem from '../../components/AddItem/EditItem';
import ItemCard from '../../components/ItemConfirm/ItemCard';
import Result from '../../components/AddItem/Result';

import * as itemActionCreators from '../../store/actions/item';
import * as additemActionCreators from '../../store/actions/additem';

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

const stubExpDate = new Date('2020/12/31')

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
  additem: {
    resultList: [{
        'name': 'item1', 
        'barcode_num': '100', 
        'expiration_date': stubExpDate, 
        'category_id': 1,
        'category_name': 'c1', 
        'container': 'freezer', 
        'count': 1
      },
      {
        'name': 'item2', 
        'barcode_num': '200', 
        'expiration_date': stubExpDate, 
        'category_id': 1,
        'category_name': 'c2', 
        'container': 'fridge', 
        'count': 2
      }]
  }
};

const mockStore = getMockStore(stubInitialState);

describe('<ItemConfirm />', () => {

  afterEach(() => {jest.clearAllMocks()})

  let itemConfirm, mockHistory, spyOnAddItem, spyOnResetItemList;

  beforeEach(() => {
    spyOnAddItem = jest.spyOn(itemActionCreators, 'addItem').mockImplementation(()=> {return dispatch => {}; });

    spyOnResetItemList = jest.spyOn(additemActionCreators, 'resetItemList').mockImplementation(()=> {return dispatch => {}; });

    mockHistory = {push: jest.fn()}

    itemConfirm = (
      <Provider store={mockStore}>
        <BrowserRouter>
        <Switch>
          <Route path='/' exact render={() => <ItemConfirm history={mockHistory} />} />
        </Switch>
        </BrowserRouter>
      </Provider>
    );
  })

  it('should render itemConfirm', async () => {
    const component = mount(itemConfirm);
    const wrapper = component.find('.ItemConfirm');
    expect(wrapper.length).toBe(1);
    await flushPromises();
  });

  it('should work well on onClickEditItemButton', async () => {
    const component = mount(itemConfirm);
    const wrapper = component.find(ItemCard).at(0).find('button');
    wrapper.simulate('click');
    component.update();
    expect(component.find('ItemConfirm').state().editingItemIdx).toEqual(1);

    const wrapper2 = component.find(EditItem).at(1).find('#FinishEditButton').find('button');
    wrapper2.simulate('click');
    component.update();
    expect(component.find(ItemCard).length).toEqual(2);

    await flushPromises();
  });

  /*
  it('should work well on onClickConfirmButton', async () => {
    const component = mount(itemConfirm);
    const wrapper = component.find('#onClickMoveToConfirmButton').find('button');
    await wrapper.simulate('click');
    expect(component.find('ItemConfirm').length).toEqual(1);

    await flushPromises();
  });*/
});