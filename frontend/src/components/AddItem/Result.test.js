import React from 'react';
import { mount } from 'enzyme';
import Result from './Result';
import { TextField, Select, Button } from '@material-ui/core';

const resultMock = {
  name: '냉장 서울우유 1L',
  barcode_num: 8801115114154,
  expiration_date: '2020/11/24',
  category_name: '우유',
  count: 4, 
  container: 'freezer'
}

const onClickCountMinusButtonMock = jest.fn();
const onClickCountPlusButtonMock = jest.fn();
const onClickRetakeBarcodeButtonMock = jest.fn();
const onClickRetakeExpirationDateButtonMock = jest.fn();
const onClickEditButtonMock = jest.fn();
const props = {
  result: resultMock,
  onClickCountMinus: onClickCountMinusButtonMock,
  onClickCountPlus: onClickCountPlusButtonMock,
  onClickRetakeBarcode: onClickRetakeBarcodeButtonMock,
  onClickRetakeExpirationDate: onClickRetakeExpirationDateButtonMock,
  onClickEdit: onClickEditButtonMock
}

describe('<Result />', () => {
  let component;
  beforeEach(() => {
    component = mount(<Result { ...props }/>);
    //component.update();
  })

  it('should work properly for getting values', () => {
    expect(component.find('#barcode_num').text()).toEqual(' Barcode: ' + resultMock.barcode_num + ' ');
    expect(component.find('#name').text()).toEqual(' Name: ' + resultMock.name + ' ');
    expect(component.find('#category_name').text()).toEqual(' Category: ' + resultMock.category_name + ' ');
    expect(component.find('#expiration_date').text()).toEqual(' Expiration Date: ' + resultMock.expiration_date + ' ');
    expect(component.find('#container').text()).toEqual(' Container: ' + resultMock.container + ' ');
  })

  it('should work properly on clicking buttons', () => {
    component.find(Button).find('#onClickCountMinusButton').find('button').simulate('click');
    expect(onClickCountMinusButtonMock).toHaveBeenCalledTimes(1);

    component.find(Button).find('#onClickCountPlusButton').find('button').simulate('click');
    expect(onClickCountPlusButtonMock).toHaveBeenCalledTimes(1);

    component.find(Button).find('#onClickRetakeBarcodeButton').find('button').simulate('click');
    expect(onClickRetakeBarcodeButtonMock).toHaveBeenCalledTimes(1);

    component.find(Button).find('#onClickRetakeExpirationDateButton').find('button').simulate('click');
    expect(onClickRetakeExpirationDateButtonMock).toHaveBeenCalledTimes(1);

    component.find(Button).find('#onClickEditButton').find('button').simulate('click');
    expect(onClickEditButtonMock).toHaveBeenCalledTimes(1);
  })
})