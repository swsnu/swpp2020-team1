import React from 'react';
import { shallow } from 'enzyme';
import Scanner from './Scanner';

const mockfn = jest.fn()

describe('Scanner()', () => {
  it('should render without errors', () => {
    const component = shallow(<Scanner id="Scanner" onDetected={mockfn}></Scanner>);
    expect(component.find("#interactive").length).toBe(1);
  })
})