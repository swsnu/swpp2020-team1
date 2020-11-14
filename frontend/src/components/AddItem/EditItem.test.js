import React from 'react';
import { shallow } from 'enzyme';
import EditItem from './EditItem';
import { Button, TextField, DialogTitle, DialogContent, DialogActions, MenuItem, InputLabel, Select } from '@material-ui/core';

let result = {
  name: 'Seoul milk',
  barcode_num: '12345678',
  expiration_date: '2020/02/10',
  category_name: 'Milk',
  count: 4, 
  container: 'freezer'
}

describe('<EditItem />', () => {
  it('should render without errors', () => {
    const component = shallow(<EditItem result={result}></EditItem>);
    let wrapper = component.find('.item_name_edit');
    expect(wrapper.length).toBe(1);
    wrapper.simulate('change', { target: { value: 'Maeil Milk' }})
    expect(component.state().name).toBe('Maeil Milk')

    wrapper = component.find('.item_barcode_edit');
    expect(wrapper.length).toBe(1);
    wrapper.simulate('change', { target: { value: '87654321' }})
    expect(component.state().barcode_num).toBe('87654321')

    wrapper = component.find('.item_expiration_date_edit');
    expect(wrapper.length).toBe(1);
    wrapper.simulate('change', { target: { value: '2020/11/14' }})
    expect(component.state().expiration_date).toBe('2020/11/14')

    wrapper = component.find('.item_count_edit');
    expect(wrapper.length).toBe(1);
    wrapper.simulate('change', { target: { value: 5 }})
    expect(component.state().count).toBe(5)

    wrapper = component.find('.item_category_name_edit');
    expect(wrapper.length).toBe(1);
    wrapper.simulate('change', { target: { value: 'Beer' }})
    expect(component.state().category_name).toBe('Beer')

    wrapper = component.find('.item_container_edit');
    expect(wrapper.length).toBe(1);
    wrapper.simulate('change', { target: { value: 'fridge' }})
    expect(component.state().container).toBe('fridge')

    wrapper = component.find('.btn_confirm_edit');
    expect(wrapper.length).toBe(1);

    wrapper = component.find('.btn_cancel_edit');
    expect(wrapper.length).toBe(1);
    //wrapper.simulate('change', { target: { value: 'Milk' }})
    //expect(component.state().name).toBe('Milk')
  })
})