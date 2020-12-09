import React from 'react';
import { mount } from 'enzyme';
import EditItem from './EditItem';
import { TextField, Select } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';

const itemMock = {
  name: '냉장 서울우유 1L',
  barcode_num: 8801115114154,
  expiration_date: '2020/11/24',
  category_name: '우유',
  category_id: 0,
  count: 4, 
  container: 'freezer'
}

const itemBlankExpDateMock = {
  name: '냉장 서울우유 1L',
  barcode_num: 8801115114154,
  expiration_date: null,
  category_name: '우유',
  category_id: 0,
  count: 4, 
  container: 'freezer'
}

const mockonChangeEditItem = jest.fn(value => value);
const onClickFinishEditItem = jest.fn();
const onClickRetakeBarcode = jest.fn();
const onClickRetakeExpirationDate = jest.fn();

const props = {
  item: itemMock,
  onChangeEditItem: mockonChangeEditItem,
  onClickFinishEditItem: onClickFinishEditItem,
  isAddItem: true,
  onClickRetakeBarcode: onClickRetakeBarcode,
  onClickRetakeExpirationDate: onClickRetakeExpirationDate
}

describe('<EditItem />', () => {
  let component;
  beforeEach(() => {
    let spyAxiosGet = jest.spyOn(axios, 'get')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({status: 200, data: [{id: 1, name: "우유"}, {id: 2, name: "맥주"}]});
        reject();
      });
    })

    component = mount(<EditItem { ...props }/>);
    //component.update();
  })

  it('should render correctly', () => {
    let wrapper = component.find(".EditItem")
    expect(wrapper.length).toBe(1);
  })
  
  it('should check expiration date when null', () => {
    const propsBlank = { item: itemBlankExpDateMock }
    let componentBlank = mount(<EditItem {...propsBlank} />).find('EditItem')
    expect(componentBlank.state().disableExpirationField).toBe(true);
  })

  it('should get correct value and changes for Name TextField', () => {
    let wrapper = component.find(TextField).find('.item_name_edit').find('input');
    expect(wrapper.props().value).toEqual(itemMock.name);
    wrapper.simulate('change', { target: { value: '냉장 매일우유 1L' }});
    expect(mockonChangeEditItem.mock.calls[mockonChangeEditItem.mock.calls.length - 1][0].name).toEqual('냉장 매일우유 1L');
  })

  it('should get correct value and changes for Barcode TextField', () => {
    let wrapper = component.find(TextField).find('.item_barcode_edit').find('input');
    expect(wrapper.props().value).toEqual(itemMock.barcode_num);
    wrapper.simulate('change', { target: { value: 123456789 }})
    expect(mockonChangeEditItem.mock.calls[mockonChangeEditItem.mock.calls.length - 1][0].barcode_num).toEqual(123456789)
  })

  it('should get correct value and changes for ExpirationDate TextField', () => {
    let wrapper = component.find(TextField).find('.item_expiration_date_edit').find('input');
    expect(wrapper.props().value).toEqual(itemMock.expiration_date);
    wrapper.simulate('change', { target: { value: '2020/11/15' }})
  })

  it('should get correct value and changes for Count TextField', () => {
    let wrapper = component.find(TextField).find('.item_count_edit').find('input');
    expect(wrapper.props().value).toEqual(itemMock.count);
    wrapper.simulate('change', { target: { value: 6 }})
    expect(mockonChangeEditItem.mock.calls[mockonChangeEditItem.mock.calls.length - 1][0].count).toEqual(6)
  })

  it('should get correct value and changes for Category TextField', () => {
    let wrapper = component.find(Autocomplete);
    expect(wrapper.props().value).toEqual(itemMock.category_name);
    wrapper.simulate('change', {target: { value: '맥주'}});
  })

  it('should get correct response for Category Checkbox', () => {
    let wrapper = component.find('.Checkbox').find('input')
    wrapper.simulate('change');
    expect(component.find('EditItem').state().disableExpirationField).toEqual(true);
  })

  it('should get correct value and changes for Container TextField', () => {
    let wrapper = component.find(Select).find('.item_container_edit').find('input');
    expect(wrapper.props().value).toEqual(itemMock.container);
    wrapper.simulate('change', { target: { value: 'fridge' }})
    expect(mockonChangeEditItem.mock.calls[mockonChangeEditItem.mock.calls.length - 1][0].container).toEqual('fridge')
  })

  it('should work well with clicking buttons', () => {
    let wrapper1 = component.find("#EditItemMinusButton").find('svg')
    wrapper1.simulate('click')
    expect(mockonChangeEditItem.mock.calls[mockonChangeEditItem.mock.calls.length - 1][0].count).toEqual(3);

    let wrapper2 = component.find("#EditItemPlusButton").find('svg')
    wrapper2.simulate('click')
    expect(mockonChangeEditItem.mock.calls[mockonChangeEditItem.mock.calls.length - 1][0].count).toEqual(5);

    let wrapper3 = component.find("#FinishEditButton")
    wrapper3.simulate('click')
    expect(onClickFinishEditItem).toHaveBeenCalledTimes(1)
  })
})