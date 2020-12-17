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
    const component = mount(<Scanner barcode={false} id="Scanner" onDetected={mockfn} />);

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

    const component = mount(<Scanner barcode={false} id="Scanner" onDetected={mockfn} />);

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

    const component = mount(<Scanner barcode={false} id="Scanner" onDetected={mockfn} />);
    expect(spyStart.mock.results[0].value).toEqual("starting");
  })

  it('should work well with _onDetected function', () => {
    spyInit.mockImplementation((input, errFunction) => {
        return errFunction();
      })

    const component = mount(<Scanner barcode={false} id="Scanner" onDetected={mockfn} />);
    expect(spyInit).toHaveBeenCalledTimes(1);
    
    component.instance()._onDetected("aa");
    expect(mockfn).toHaveBeenCalledTimes(1);
    expect(mockfn.mock.results[0].value).toEqual('returning aa')
  })

  it('should work well with onComponentWillUnmount', () => {
    const spyOffDetected = jest.spyOn(Quagga, 'offDetected')
    spyOffDetected.mockImplementation((func) => {return func})

    const spyStop = jest.spyOn(Quagga, 'stop')
    spyStop.mockImplementation((func) => {return func})
    
    spyInit.mockImplementation((input, errFunction) => {
        return input;
      })

    const component = mount(<Scanner barcode={true} id="Scanner" onDetected={mockfn} />);
    expect(spyInit).toHaveBeenCalledTimes(1);
    
    component.unmount();
    expect(spyOffDetected).toHaveBeenCalledTimes(1);
    expect(spyStop).toHaveBeenCalledTimes(1);
  })

  it('should check the value constraint well', () => {
    Object.defineProperty(navigator, "userAgent", { 
        get: function () { 
            return "Android"; // customized user agent
        },
        configurable: true
    });
    const component = mount(<Scanner barcode={false} id="Scanner" onDetected={mockfn} />);

    expect(component.find("#interactive").length).toBe(1);
  })

  it('should check the innerWidth and innerHeight well', () => {
    Object.defineProperty(navigator, "userAgent", { 
        get: function () { 
            return "custom"; // customized user agent
        },
        configurable: true
    });
    
    Object.defineProperty(window, "innerWidth", { 
      configurable: true,
      writable: true,
      value: 500
    })

    Object.defineProperty(window, "innerHeight", { 
      configurable: true,
      writable: true,
      value: 500
    })
    
    const component = mount(<Scanner barcode={false} id="Scanner" onDetected={mockfn} />);
    expect(component.find("#interactive").length).toBe(1);
  })
})