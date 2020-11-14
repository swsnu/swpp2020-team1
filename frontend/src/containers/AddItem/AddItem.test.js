import React from 'react';
import { shallow, mount } from 'enzyme';
import AddItem from './AddItem';
import EditItem from '../../components/AddItem/EditItem';
import Scanner from '../../components/AddItem/Scanner';
import Result from '../../components/AddItem/Result';
import { Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions, MenuItem, InputLabel, Select } from '@material-ui/core';
import Quagga from 'quagga';
import axios from 'axios';

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

let mockHistory = {push: jest.fn()};
jest.mock('axios');
jest.mock('../../components/AddItem/Scanner')

describe('<AddItem />', () => {
  it('should render EditItem and change information correctly', () => {
    const component = mount(<AddItem history={mockHistory} location={{state: {container: "fridge"}}}></AddItem>);
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

  it('should get a default container value as freezer', () => {
    const component = mount(<AddItem history={mockHistory} location={{state: {container: "fridge"}}}></AddItem>);
    component.setState({ is_editing: true, currentResult: result2 })
    component.update()

    let wrapper2 = component.find(EditItem).find(Select);
    expect(wrapper2.text()).toBe("freezer");
  })

  it('should render Scanner correctly', async () => {
    const component = mount(<AddItem location={{state: {container: "fridge", currentResult: result }}}></AddItem>);
    await component.update()
    expect(component.find('button').find('#handleOCR').length).toBe(1);
    await component.find('button').find('#handleOCR').simulate('click');
    
    await component.instance().forceUpdate()
    await component.update()
    expect(component.find('#Scanner').length).toBe(1);

    component.setState({ is_retaking: false })
    await component.find('button').find('#handleOCR').simulate('click');
  })

    it('should render Scanner correctly 2', async () => {
    const component = mount(<AddItem location={{state: {container: "fridge" }}}></AddItem>);
    await component.update()
    
    expect(component.find('button').find('#handleOCR').length).toBe(1);
    component.setState({currentResult: result, is_retaking: false})
    await component.find('button').find('#handleOCR').simulate('click');
    
    await component.instance().forceUpdate()
    await component.update()
    expect(component.find('#Scanner').length).toBe(1);
  })

  it('should render ManuallAdd correctly', async () => {
    const component = mount(<AddItem history={mockHistory} location={{state: {container: "fridge"}}}></AddItem>);
    await component.update()
    expect(component.find('button').find('#AddManuallyButton').length).toBe(1);
    component.find('button').find('#AddManuallyButton').simulate('click');
    
    await component.instance().forceUpdate()
    await component.update()

    expect(component.find(EditItem).length).toBe(1);
    component.find(EditItem).find('button').find('.btn_cancel_edit').simulate('click')
    await component.update()

    component.setState({ is_confirmed: false, currentResult: result })
    await component.update()
    expect(component.find('button').find('#AddManuallyButton').length).toBe(1);
    component.find('button').find('#AddManuallyButton').simulate('click');

    await component.instance().forceUpdate()
    await component.update()

    expect(component.find(EditItem).length).toBe(1);
  })

  it('should render Result value correctly', async () => {
    const component = mount(<AddItem history={mockHistory} location={{state: {container: "fridge"}}}></AddItem>);
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

  it('should render Result value correctly 2', async () => {
    const component = mount(<AddItem history={mockHistory} location={{state: {container: "fridge"}}}></AddItem>);
    await component.update()
    component.setState({ is_confirmed: false, currentResult: result })
    
    await component.instance().forceUpdate()
    await component.update()

    const wrapper = component.find(Result)
    expect(wrapper.length).toBe(1);

    wrapper.find('button').find('#onClickRetakeBarcodeButton').simulate('click');
    await component.update()
    expect(component.state()["is_retaking"]).toBe(true);
    component.setState({ is_confirmed: false, is_retaking: false, currentResult: result })

    await component.update()
    wrapper.find('button').find('#onClickRetakeExpirationDateButton').simulate('click');
    expect(component.state()["is_retaking"]).toBe(true);
    await component.update()

  })

  

  it('should move all the information to Confirm Page correctly', async () => {
    const component = mount(<AddItem history={mockHistory} location={{state: {container: "fridge"}}}></AddItem>);
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
    const component = mount(<AddItem history={mockHistory} location={{state: {container: "fridge"}}}></AddItem>);
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
    const component = mount(<AddItem history={mockHistory} location={{state: {container: "fridge"}}}></AddItem>);
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

  it('should work _onDetected function', async () => {
    const component = mount(<AddItem location={{state: {container: "fridge"}}}></AddItem>);
    await component.update()
    component.instance()._onDetected("8801231255");
    component.setState({ is_barcode_scanning: true });
    axios.get.mockResolvedValue(({
      data: [{
        barcode_id: "8801231255",
        name: "milk",
        user_id: 1
      }]
    }))
    component.instance()._onDetected({ codeResult: { code: 8801231255 } });

    const wrapper = component.find('textarea').find('#ExpirationDateTextField')
    expect(wrapper.length).toBe(1);
  })

  it('should work _onDetected function 2', async () => {
    const component = mount(<AddItem location={{state: {container: "fridge"}}}></AddItem>);
    await component.update()
    component.instance()._onDetected("8801231255");
    component.setState({ is_barcode_scanning: true });

    axios.get.mockResolvedValue(({
      data: [{
      }]
    }))
    component.instance()._onDetected({ codeResult: { code: 8801231255 } });

    const wrapper = component.find('textarea').find('#ExpirationDateTextField')
    expect(wrapper.length).toBe(1);
  })

  it('should work handleDetect function', async () => {
    const component = mount(<AddItem location={{state: {container: "fridge"}}}></AddItem>);
    await component.update()
    component.instance().handleDetect("////2020.11.14/////");
    expect(component.state().OCRResult).toEqual('2020/11/14');
  })
})