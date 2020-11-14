import React from 'react';
import { shallow, mount } from 'enzyme';
import AddItem from './AddItem';
import EditItem from '../../components/AddItem/EditItem';
import Scanner from '../../components/AddItem/Scanner';
import Result from '../../components/AddItem/Result';
import { Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions, MenuItem, InputLabel, Select } from '@material-ui/core';
import Quagga from 'quagga';

let result = {
  name: 'Seoul milk',
  barcode_num: '12345678',
  expiration_date: '2020/02/10',
  category_name: 'Milk',
  count: 4, 
  container: 'freezer'
}

let result2 = {
  name: null,
  barcode_num: null,
  expiration_date: null,
  category_name: null,
  count: null, 
  container: null
}

describe('<AddItem />', () => {
  it('should render without errors', () => {
    const component = mount(<AddItem location={{state: {container: "fridge"}}}></AddItem>);
    component.setState({ is_editing: true, currentResult: result })
    component.update()

    let wrapper = component.find(EditItem)
    expect(wrapper.length).toBe(1);
    //console.log(wrapper.debug())
    expect(wrapper.find(Button).at(1).length).toBe(1);
    wrapper.setState({ container: "fridge" })
    //wrapper.find(InputLabel).at(0).simulate('change', { target: { value: 'Maeil Milk' }})
    //console.log(wrapper.state())
    wrapper.find(Button).at(1).simulate('click')
    expect(component.state().currentResult.container).toBe('fridge');
  })

  it('should render without error', () => {
    const component2 = mount(<AddItem location={{state: {container: "fridge"}}}></AddItem>);
    component2.setState({ is_editing: true, currentResult: result2 })
    component2.update()

    let wrapper2 = component2.find(EditItem).find(Select);
    expect(wrapper2.text()).toBe("freezer");
  })

  /*it('should render without error3', async () => {
    const component3 = mount(<AddItem location={{state: {container: "fridge"}}}></AddItem>);
    await component3.update()
    expect(component3.find('button').find('#handleOCR').length).toBe(1);
    await component3.find('button').find('#handleOCR').simulate('click');
    
    await component3.instance().forceUpdate()
    await component3.update()
    console.log(component3.debug())
    expect(component3.find('#Scanner').length).toBe(1);
    //find('#handleOCR').simulate('click')
    //component3.setState({ is_barcode_scanning: true })
    //component3.update()
  })*/

  it('should render without error4', async () => {
    const component4 = mount(<AddItem location={{state: {container: "fridge"}}}></AddItem>);
    await component4.update()
    expect(component4.find('button').find('#AddManuallyButton').length).toBe(1);
    component4.find('button').find('#AddManuallyButton').simulate('click');
    
    await component4.instance().forceUpdate()
    await component4.update()

    expect(component4.find(EditItem).length).toBe(1);
    component4.find(EditItem).find('button').find('.btn_cancel_edit').simulate('click')
    await component4.update()

    component4.setState({ is_confirmed: false, currentResult: result })
    await component4.update()
    expect(component4.find('button').find('#AddManuallyButton').length).toBe(1);
    component4.find('button').find('#AddManuallyButton').simulate('click');

    await component4.instance().forceUpdate()
    await component4.update()

    expect(component4.find(EditItem).length).toBe(1);
    //expect(component3.find('#Scanner').length).toBe(1);
    //find('#handleOCR').simulate('click')
    //component3.setState({ is_barcode_scanning: true })
    //component3.update()
  })

  it('should render without error5', async () => {
    const component = mount(<AddItem location={{state: {container: "fridge"}}}></AddItem>);
    await component.update()
    component.setState({ is_confirmed: false, currentResult: result })
    
    await component.instance().forceUpdate()
    await component.update()

    const wrapper = component.find(Result)
    expect(wrapper.length).toBe(1);

    wrapper.find('button').find('#onClickCountMinusButton').simulate('click');
    expect(component.state().currentResult.count).toEqual(3);

    component.setState({ currentResult: { ...component.state().currentResult, count: 1 }})
    wrapper.find('button').find('#onClickCountMinusButton').simulate('click');
    expect(component.state().currentResult.count).toEqual(1);

    wrapper.find('button').find('#onClickCountPlusButton').simulate('click');
    expect(component.state().currentResult.count).toEqual(2);

    wrapper.find('button').find('#onClickEditButton').simulate('click');
    await component.update()
    expect(component.find(EditItem).length).toEqual(1);
  })

  it('should render without error5', async () => {
    const component = mount(<AddItem location={{state: {container: "fridge"}}}></AddItem>);
    await component.update()
    component.setState({ is_confirmed: false, currentResult: result })
    
    await component.instance().forceUpdate()
    await component.update()

    const wrapper = component.find('button').find('#onClickMoveToConfirmButton')
    expect(wrapper.length).toBe(1);
    wrapper.simulate('click');
    await component.update()
    expect(component.state().resultList).toEqual([result]);
  })

  it('should turn off the webcam when clicking WEBCAM ON/OFF', async () => {
    const component = mount(<AddItem location={{state: {container: "fridge"}}}></AddItem>);
    await component.update()
    component.setState({ is_confirmed: false, currentResult: result })
    await component.update()

    const wrapper = component.find('button').find('#onClickWebcamOnOffButton')
    expect(wrapper.length).toBe(1);
    wrapper.simulate('click');
    await component.update()
    expect(component.state().webcam).toEqual(false);

    wrapper.simulate('click');
    await component.update()
    expect(component.state().webcam).toEqual(true);
  })

  it('should work with setExpirationDate function', async () => {
    const component = mount(<AddItem location={{state: {container: "fridge"}}}></AddItem>);
    await component.update()
    component.setState({ is_confirmed: false, currentResult: result })
    await component.update()

    const wrapper = component.find('textarea').find('#ExpirationDateTextField')
    console.log(wrapper.debug())
    expect(wrapper.length).toBe(1);
    wrapper.simulate('change', { target: { value: '2020/03/22' }})
    await component.update()
    expect(component.state().OCRResult).toEqual('2020/03/22');
  })

  /*it('should work _onDetected function', async () => {
    const component = mount(<AddItem location={{state: {container: "fridge"}}}></AddItem>);
    await component.update()
    component.instance()._onDetected("8801231255");
    component.setState({ is_barcode_scanning: true });
    component.instance()._onDetected("8801231255");

    const wrapper = component.find('textarea').find('#ExpirationDateTextField')
    expect(wrapper.length).toBe(1);
  })*/
})