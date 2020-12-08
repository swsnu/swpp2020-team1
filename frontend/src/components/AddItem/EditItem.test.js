import React from 'react';
import axios from 'axios';
import { shallow, mount } from 'enzyme';
import EditItem from './EditItem';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';
import { TextField, Select, Button } from '@material-ui/core';
import { editItemCount } from '../../store/actions';
//import { it } from 'date-fns/locale';
import { getMockStore } from '../../mock';

const resultMock0 = {
  name: '냉장 서울우유 1L',
  barcode_num: 8801115114154,
  expiration_date: '2020/11/24',
  category_name: '우유',
  category_id: 0,
  count: 4, 
  container: 'freezer'
}

const resultMock1 = {
  name: '냉장 서울우유 1L',
  barcode_num: 8801115114154,
  expiration_date: null,
  category_name: '우유',
  category_id: 0,
  count: 4, 
  container: 'freezer'
}

const stubInitialState = {
  additem: {
    resultList: [resultMock0, resultMock1]
  }
}

const mockStore = getMockStore(stubInitialState);

const onCancelEditMock = jest.fn();
const onConfirmEditMock = jest.fn().mockResolvedValue({
  resultMock0
});

const props = {
  result: resultMock0,
  onCancelEdit: onCancelEditMock,
  onConfirmEdit: onConfirmEditMock
}

describe('<EditItem //>', () => {
  let editItem;

  beforeEach(() => {
    editItem = (id) => {
      return (
      <Provider store={mockStore}>
        <BrowserRouter>
        <Switch>
          <Route path='/' exact render={() => <EditItem id={id} />} />
        </Switch>
        </BrowserRouter>
      </Provider>
    )}
  })

  it('should render EditItem', () => {
    const component = mount(editItem(0));
    const wrapper = component.find('.EditItem');
    expect(wrapper.length).toBe(1);
  })

  it('should render EditItem when expiration date is null', () => {
    const component = mount(editItem(1));
    const wrapper = component.find('.EditItem');
    expect(wrapper.length).toBe(1);
  })

  it('should get correct value and changes for Name TextField', () => {
    let wrapper = mount(editItem(0)).find(TextField).find('.item_name_edit').find('input');
    expect(wrapper.props().value).toEqual(resultMock0.name);
    wrapper.simulate('change', { target: { value: '냉장 매일우유 1L' }})
    //expect(wrapper.props().value).toEqual('냉장 매일우유 1L')
  })

  it('should get correct value and changes for Barcode TextField', () => {
    let wrapper = mount(editItem(0)).find(TextField).find('.item_barcode_edit').find('input');
    expect(wrapper.props().value).toEqual(resultMock0.barcode_num);
    wrapper.simulate('change', { target: { value: 123456789 }})
    //expect(wrapper.props().value).toEqual(123456789)
  })

  it('should get correct value and changes for ExpirationDate TextField', () => {
    let wrapper = mount(editItem(0)).find(TextField).find('.item_expiration_date_edit').find('input');
    expect(wrapper.props().value).toEqual(resultMock0.expiration_date);
    wrapper.simulate('change', { target: { value: '2020/11/15' }})
    //expect(wrapper.props().value).toEqual('2020/11/15')
  })

  it('should get correct value and changes for Count TextField', () => {
    let wrapper = mount(editItem(0)).find(TextField).find('.item_count_edit').find('input');
    expect(wrapper.props().value).toEqual(resultMock0.count);
    wrapper.simulate('change', { target: { value: 6 }})
    //expect(wrapper.props().value).toEqual(6)
  })

  it('should get correct value and changes for Category TextField', () => {
    const spyGet = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          resolve({data: []});
        })
      })
    
    let wrapper = mount(editItem(0)).find('.item_category_name_edit').find('input');
    expect(wrapper.props().value).toEqual(resultMock0.category_name);
    console.log(mount(editItem(0)).debug())
    wrapper.simulate('change', { target: { value: '맥주' }})
    //expect(wrapper.props().value).toEqual('맥주')
  })

  it('should get correct value and changes for Container TextField', () => {
    const spyGet = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          resolve({data: []});
        })
      })
    
    let wrapper = mount(editItem(0)).find(Select).find('.item_container_edit').find('input');
    expect(wrapper.props().value).toEqual(resultMock0.container);
    wrapper.simulate('change', { target: { value: 'fridge' }})
    //expect(wrapper.props().value).toEqual('fridge')
  })
})

/*

  it('should work properly for blank result', () => {
    const resultBlankMock = {}
    const propsBlank = { result: resultBlankMock, onCancelEdit: onCancelEditMock, onConfirmEdit: onConfirmEditMock }
    let componentBlank = mount(<EditItem { ...propsBlank }/>)
    expect(componentBlank.state().name).toEqual('');
    expect(componentBlank.state().barcode_num).toEqual('');
    expect(componentBlank.state().expiration_date).toEqual('');
    expect(componentBlank.state().category_name).toEqual('');
    expect(componentBlank.state().count).toEqual(1);
    expect(componentBlank.state().container).toEqual('freezer');
  })


  it('should work properly on onConfirmEdit button', () => {
    let wrapper = component.find(Button).find('.btn_confirm_edit').find('button');
    wrapper.simulate('click')
    expect(onConfirmEditMock).toHaveBeenCalledTimes(1);
    expect(onConfirmEditMock).toHaveBeenCalledWith(resultMock);
  })

  it('should work properly on onCancelEdit button', () => {
    let wrapper = component.find(Button).find('.btn_cancel_edit').find('button');
    wrapper.simulate('click')
    expect(onCancelEditMock).toHaveBeenCalledTimes(1);
  })
})
*/
