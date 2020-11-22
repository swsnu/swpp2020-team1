import React from 'react';
import { shallow, mount } from 'enzyme';
import AddItem from './AddItem';
import EditItem from '../../components/AddItem/EditItem';
import Result from '../../components/AddItem/Result';
import { Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions, MenuItem, InputLabel, Select } from '@material-ui/core';
import Quagga from 'quagga';
import axios from 'axios';
import Webcam from 'react-webcam';

let result = {
  name: '서울우유 1L',
  barcode_num: '8801115114154',
  expiration_date: '2020/02/10',
  category_name: 'Milk',
  count: 4, 
  container: 'freezer'
}

let resultBlank = {
  name: null,
  barcode_num: null,
  expiration_date: null,
  category_name: null,
  count: null, 
  container: null
}

let containerAddItem;
jest.mock('axios');
jest.mock('../../components/AddItem/Scanner')

describe('<AddItem />', () => {
  beforeEach(() => {
    containerAddItem = mount(<AddItem history={{push: jest.fn()}} location={{state: {container: "fridge"}}}/>);
    containerAddItem.update();
  })

  it('should work properly for all functions of EditItem component', () => {
    containerAddItem.setState({ is_editing: true, is_barcode_scanning: true, currentResult: result })
    containerAddItem.update()

    //check onCancelEditButton function
    containerAddItem.instance().onCancelEditButton()
    containerAddItem.update()
    expect(containerAddItem.state().is_editing).toEqual(false);

    //check onConfirmEditButton function
    containerAddItem.setState({ is_editing: true })
    containerAddItem.update()
    containerAddItem.instance().onConfirmEditButton(resultBlank)
    containerAddItem.update()
    
    expect(containerAddItem.state().currentResult).toEqual(resultBlank);
    expect(containerAddItem.state().is_editing).toEqual(false);
    expect(containerAddItem.state().is_barcode_scanning).toEqual(false);
    expect(containerAddItem.state().is_confirmed).toEqual(false);
  })

  it('should work properly for ManualAdd button', async () => {
    //if is_confirmed is true: Result component is not activated
    containerAddItem.setState({ is_confirmed: true, currentResult: result })
    await containerAddItem.update()
    expect(containerAddItem.find(Result).length).toBe(0);

    containerAddItem.find('button').find('#AddManuallyButton').simulate('click');
    await containerAddItem.update()

    expect(containerAddItem.state().is_editing).toEqual(true);
    expect(containerAddItem.find(EditItem).length).toBe(1);

    //if is_confirmed is false: Result component is activated
    containerAddItem.setState({ is_confirmed: false, is_editing: false, currentResult: result })
    await containerAddItem.update()
    expect(containerAddItem.find(Result).length).toBe(1);

    containerAddItem.find('button').find('#AddManuallyButton').simulate('click');
    await containerAddItem.update()

    expect(containerAddItem.state().screenShot).toEqual(null);
    expect(containerAddItem.state().imageFile).toEqual(null);
    expect(containerAddItem.state().resultList).toEqual([result]);
    expect(containerAddItem.state().is_editing).toEqual(true);
    expect(containerAddItem.find(EditItem).length).toBe(1);
  })

  //여기서부터 다시 짜야함
  it('should change camera and view when clicking Capture Screen button', async () => {
    await containerAddItem.find('button').find('#handleOCR').simulate('click');
    
    await containerAddItem.instance().forceUpdate()
    await containerAddItem.update()
    expect(containerAddItem.find(Webcam).length).toBe(0);
    expect(containerAddItem.find('#Scanner').length).toBe(1);

    //containerAddItem.setState({ is_retaking: false })
    //await containerAddItem.find('button').find('#handleOCR').simulate('click');
  })

  it('should render Scanner correctly 2', async () => {
    await containerAddItem.update()
    
    expect(containerAddItem.find('button').find('#handleOCR').length).toBe(1);
    containerAddItem.setState({currentResult: result, is_retaking: false})
    await containerAddItem.find('button').find('#handleOCR').simulate('click');
    
    await containerAddItem.instance().forceUpdate()
    await containerAddItem.update()
    expect(containerAddItem.find('#Scanner').length).toBe(1);
  })



  it('should render Result value correctly', async () => {
    await containerAddItem.update()
    containerAddItem.setState({ is_confirmed: false, currentResult: result })
    
    await containerAddItem.instance().forceUpdate()
    await containerAddItem.update()

    const wrapper = containerAddItem.find(Result)
    expect(wrapper.length).toBe(1);

    wrapper.find('button').find('#onClickCountMinusButton').simulate('click');
    expect(containerAddItem.state().currentResult.count).toEqual(3);

    containerAddItem.setState({ currentResult: { ...containerAddItem.state().currentResult, count: 1 }})
    wrapper.find('button').find('#onClickCountMinusButton').simulate('click');
    expect(containerAddItem.state().currentResult.count).toEqual(1);

    wrapper.find('button').find('#onClickCountPlusButton').simulate('click');
    expect(containerAddItem.state().currentResult.count).toEqual(2);

    wrapper.find('button').find('#onClickEditButton').simulate('click');
    await containerAddItem.update()
    expect(containerAddItem.find(EditItem).length).toEqual(1);
  })

  it('should render Result value correctly 2', async () => {
    await containerAddItem.update()
    containerAddItem.setState({ is_confirmed: false, currentResult: result })
    
    await containerAddItem.instance().forceUpdate()
    await containerAddItem.update()

    const wrapper = containerAddItem.find(Result)
    expect(wrapper.length).toBe(1);

    wrapper.find('button').find('#onClickRetakeBarcodeButton').simulate('click');
    await containerAddItem.update()
    expect(containerAddItem.state()["is_retaking"]).toBe(true);
    containerAddItem.setState({ is_confirmed: false, is_retaking: false, currentResult: result })

    await containerAddItem.update()
    wrapper.find('button').find('#onClickRetakeExpirationDateButton').simulate('click');
    expect(containerAddItem.state()["is_retaking"]).toBe(true);
    await containerAddItem.update()

  })

  

  it('should move all the information to Confirm Page correctly', async () => {
    await containerAddItem.update()
    containerAddItem.setState({ is_confirmed: false, currentResult: result })
    
    await containerAddItem.instance().forceUpdate()
    await containerAddItem.update()

    const wrapper = containerAddItem.find('button').find('#onClickMoveToConfirmButton')
    expect(wrapper.length).toBe(1);
    wrapper.simulate('click');
    await containerAddItem.update()
    expect(containerAddItem.state().resultList).toEqual([result]);
  })

  it('should turn off the webcam when clicking WEBCAM ON/OFF', async () => {
    await containerAddItem.update()
    containerAddItem.setState({ is_confirmed: false, currentResult: result })
    await containerAddItem.update()

    const wrapper = containerAddItem.find('button').find('#onClickWebcamOnOffButton')
    expect(wrapper.length).toBe(1);
    wrapper.simulate('click');
    await containerAddItem.update()
    expect(containerAddItem.state().webcam).toEqual(false);

    wrapper.simulate('click');
    await containerAddItem.update()
    expect(containerAddItem.state().webcam).toEqual(true);
  })

  it('should work with setExpirationDate function', async () => {
    await containerAddItem.update()
    containerAddItem.setState({ is_confirmed: false, currentResult: result })
    await containerAddItem.update()

    const wrapper = containerAddItem.find('textarea').find('#ExpirationDateTextField')
    console.log(wrapper.debug())
    expect(wrapper.length).toBe(1);
    wrapper.simulate('change', { target: { value: '2020/03/22' }})
    await containerAddItem.update()
    expect(containerAddItem.state().OCRResult).toEqual('2020/03/22');
  })

  it('should work _onDetected function', async () => {
    await containerAddItem.update()
    containerAddItem.instance()._onDetected("8801115114154");
    containerAddItem.setState({ is_barcode_scanning: true });
    axios.get.mockResolvedValueOnce(({
      data: [{
        barcode_id: "8801115114154",
        name: "custom_item milk",
        user_id: 1
      }]
    }))
    /* AddItem Promise로 연결해야 함 */
    axios.get.mockResolvedValueOnce()
    containerAddItem.instance()._onDetected({ codeResult: { code: 8801115114154 } });

    const wrapper = containerAddItem.find('textarea').find('#ExpirationDateTextField')
    expect(wrapper.length).toBe(1);
  })

  it('should work _onDetected function 2', async () => {
    await containerAddItem.update()
    containerAddItem.instance()._onDetected("8801115114154");
    containerAddItem.setState({ is_barcode_scanning: true });

    axios.get.mockResolvedValue(({
      data: [{
      }]
    }))
    containerAddItem.instance()._onDetected({ codeResult: { code: 8801115114154 } });

    const wrapper = containerAddItem.find('textarea').find('#ExpirationDateTextField')
    expect(wrapper.length).toBe(1);
  })

  it('should work handleDetect function', async () => {
    await containerAddItem.update()
    containerAddItem.instance().handleDetect("////2020.11.14/////");
    expect(containerAddItem.state().OCRResult).toEqual('2020/11/14');
  })
})