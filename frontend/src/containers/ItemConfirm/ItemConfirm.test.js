import React from 'react';
import axios from 'axios';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';

import ItemConfirm from './ItemConfirm';
import { getMockStore } from '../../mock';
import * as itemActionCreators from '../../store/actions/item';
import * as itemcountActionCreators from '../../store/actions/itemcount';
import { Typography, Container, Button, TextField, Select, InputLabel, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Card, Grid } from "@material-ui/core";


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

describe('<ItemConfirm />', () => {

  afterEach(() => {jest.clearAllMocks()})

  let itemConfirm, mockHistory, mockLocation;
  beforeEach(() => {

    mockHistory = {push: jest.fn()}
    mockLocation = {state: {items: [
      {
        'name': 'item1', 
        'barcode_num': '100', 
        'expiration_date': '2020/12/31', 
        'category_id': 1,
        'category_name': 'c1', 
        'container': 'freezer', 
        'count': 1
      },
      {
        'name': 'item2', 
        'barcode_num': '200', 
        'expiration_date': '2020/12/31', 
        'category_id': 1,
        'category_name': 'c2', 
        'container': 'fridge', 
        'count': 2
      },
    ]}}
    itemConfirm = (
      <Provider store={mockStore}>
        <BrowserRouter>
        <Switch>
          <Route path='/' exact render={() => <ItemConfirm history={mockHistory} location={mockLocation}/>} />
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

  it('should handle add item', async () => {
    const component = mount(itemConfirm);
    const itemConfirmInstance = component.find(ItemConfirm.WrappedComponent).instance();

    const name = component.find('.item_name_create input');
    name.simulate('change', { target: { value: 'name' } });
    expect(itemConfirmInstance.state.name_create).toEqual('name');
    const barcode = component.find('.item_barcode_create input');
    barcode.simulate('change', { target: { value: '100' } });
    expect(itemConfirmInstance.state.barcode_create).toEqual('100');
    const expiration_date = component.find('.item_expiration_date_create input');
    expiration_date.simulate('change', { target: { value: '2020/12/31' } });
    expect(itemConfirmInstance.state.expiration_date_create).toEqual('2020/12/31');
    const count = component.find('.item_count_create input');
    count.simulate('change', { target: { value: '3' } });
    expect(itemConfirmInstance.state.count_create).toEqual('3');
    const category = component.find('.item_category_name_create input');
    category.simulate('change', { target: { value: 'c1' } });
    expect(itemConfirmInstance.state.category_name_create).toEqual('c1');

    // add item
    const addItemButton = component.find('.btn_add_item button');
    addItemButton.simulate('click');
    expect(itemConfirmInstance.state.items.length).toBe(3);

    // confirm
    const confirmButton = component.find('.btn_confirm button');
    confirmButton.simulate('click');
    expect(mockHistory.push).toHaveBeenCalled();
  })

  it('should render edit dialog', () => {
    const component = mount(itemConfirm);
    const itemConfirmInstance = component.find(ItemConfirm.WrappedComponent).instance();
    const editItemButton = component.find('.btn_item_edit button').at(0);
    // start edit
    editItemButton.simulate('click');
    expect(itemConfirmInstance.state.editDialogOpen).toBe(true);
    // cancel edit
    const cancelItemEditButton = component.find('.btn_cancel_edit button');
    cancelItemEditButton.simulate('click');
    expect(itemConfirmInstance.state.editDialogOpen).toBe(false);

    // start edit
    editItemButton.simulate('click');
    expect(itemConfirmInstance.state.editDialogOpen).toBe(true);
    // confirm edit
    const confirmItemEditButton = component.find('.btn_confirm_edit button');
    confirmItemEditButton.simulate('click');
    expect(itemConfirmInstance.state.editDialogOpen).toBe(false);
    expect(itemConfirmInstance.state.items.length).toBe(2);

  })

  it('should handle click webcam mode button', () => {
    const component = mount(itemConfirm);
    const webcamModeButton = component.find('.btn_webcam_mode button');
    webcamModeButton.simulate('click');
    expect(mockHistory.push).toHaveBeenCalled();
 
  })

});

