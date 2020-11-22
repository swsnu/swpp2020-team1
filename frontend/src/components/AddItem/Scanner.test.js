import React from 'react';
import { shallow, mount } from 'enzyme';
import Scanner from './Scanner';
import Quagga from 'quagga';

const mockfn = jest.fn();
let spyInit, spyStart;

describe('Scanner()', () => {
  beforeEach(() => {
    mockfn.mockImplementation((input) => ('returning '+input));
    spyInit = jest.spyOn(Quagga, 'init')
  })

  it('should initialize and render Scanner well', () => {
    spyInit.mockImplementation((input, errFunction) => {
        return input;
      })
    const component = mount(<Scanner id="Scanner" onDetected={mockfn} />);

    expect(spyInit).toHaveBeenCalledTimes(1);
    expect(spyInit.mock.results[0].value.inputStream.type).toEqual("LiveStream");
    expect(component.find("#interactive").length).toBe(1);
  })

  it('should handle error well', () => {
    const spyOnConsole = jest.spyOn(global.console, 'log')
    spyOnConsole.mockImplementation((value) => (value + ' is returned'))

    spyInit.mockImplementation((input, errFunction) => {
        return errFunction('error occurred');
      })
    const component = mount(<Scanner id="Scanner" onDetected={mockfn} />);

    expect(spyOnConsole.mock.results[0].value).toEqual("error occurred is returned");
    expect(component.find("#interactive").length).toBe(1);
  })

  it('should handle error well without error value', () => {
    spyStart = jest.spyOn(Quagga, 'start')
      .mockImplementation(() => {
        return "starting";
      })

    spyInit.mockImplementation((input, errFunction) => {
        return errFunction();
      })

    const component = mount(<Scanner id="Scanner" onDetected={mockfn} />);
    expect(spyStart.mock.results[0].value).toEqual("starting");
  })

  it('should work well with _onDetected function', () => {
    spyInit.mockImplementation((input, errFunction) => {
        return errFunction();
      })

    const component = mount(<Scanner id="Scanner" onDetected={mockfn} />);
    expect(spyInit).toHaveBeenCalledTimes(1);
    
    component.instance()._onDetected("aa");
    expect(mockfn).toHaveBeenCalledTimes(1);
    expect(mockfn.mock.results[0].value).toEqual('returning aa')
  })

  it('should work well with onComponentWillUnmount', () => {
    const spyUnmount = jest.spyOn(Quagga, 'offDetected')
    spyUnmount.mockImplementation((func) => {return func})
    
    spyInit.mockImplementation((input, errFunction) => {
        return input;
      })

    const component = mount(<Scanner id="Scanner" onDetected={mockfn} />);
    expect(spyInit).toHaveBeenCalledTimes(1);
    
    component.unmount();
    expect(spyUnmount).toHaveBeenCalledTimes(1);
  })
})