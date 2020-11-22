import React from 'react';
import { shallow, mount } from 'enzyme';
import EditItem from './EditItem';
import { TextField, Select, Button } from '@material-ui/core';

const resultMock = {
  name: '냉장 서울우유 1L',
  barcode_num: 8801115114154,
  expiration_date: '2020/11/24',
  category_name: '우유',
  category_id: 0,
  count: 4, 
  container: 'freezer'
}
const onCancelEditMock = jest.fn();
const onConfirmEditMock = jest.fn().mockResolvedValue({
  resultMock
});
const props = {
  result: resultMock,
  onCancelEdit: onCancelEditMock,
  onConfirmEdit: onConfirmEditMock
}

describe('<EditItem />', () => {
  let component;
  beforeEach(() => {
    component = mount(<EditItem { ...props }/>);
    //component.update();
  })

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

  it('should get correct value and changes for Name TextField', () => {
    let wrapper = component.find(TextField).find('.item_name_edit').find('input');
    expect(wrapper.props().value).toEqual(resultMock.name);
    wrapper.simulate('change', { target: { value: '냉장 매일우유 1L' }})
    expect(component.state().name).toEqual('냉장 매일우유 1L')
  })

  it('should get correct value and changes for Barcode TextField', () => {
    let wrapper = component.find(TextField).find('.item_barcode_edit').find('input');
    expect(wrapper.props().value).toEqual(resultMock.barcode_num);
    wrapper.simulate('change', { target: { value: 123456789 }})
    expect(component.state().barcode_num).toEqual(123456789)
  })

  it('should get correct value and changes for ExpirationDate TextField', () => {
    let wrapper = component.find(TextField).find('.item_expiration_date_edit').find('input');
    expect(wrapper.props().value).toEqual(resultMock.expiration_date);
    wrapper.simulate('change', { target: { value: '2020/11/15' }})
    expect(component.state().expiration_date).toEqual('2020/11/15')
  })

  it('should get correct value and changes for Count TextField', () => {
    let wrapper = component.find(TextField).find('.item_count_edit').find('input');
    expect(wrapper.props().value).toEqual(resultMock.count);
    wrapper.simulate('change', { target: { value: 6 }})
    expect(component.state().count).toEqual(6)
  })

  it('should get correct value and changes for Category TextField', () => {
    let wrapper = component.find(TextField).find('.item_category_name_edit').find('input');
    expect(wrapper.props().value).toEqual(resultMock.category_name);
    wrapper.simulate('change', { target: { value: '맥주' }})
    expect(component.state().category_name).toEqual('맥주')
  })

  it('should get correct value and changes for Container TextField', () => {
    let wrapper = component.find(Select).find('.item_container_edit').find('input');
    console.log(wrapper.debug())
    expect(wrapper.props().value).toEqual(resultMock.container);
    wrapper.simulate('change', { target: { value: 'fridge' }})
    expect(component.state().container).toEqual('fridge')
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
