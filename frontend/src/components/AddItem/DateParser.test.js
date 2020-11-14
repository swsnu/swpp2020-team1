import React from 'react';
import { shallow } from 'enzyme';
import parseDate from './DateParser';

describe('parseDate()', () => {
  it('should render without errors', () => {
    expect(parseDate("exp: 31.10..2021//")).toBe("2021/10/31")
    expect(parseDate("2021.10.11////")).toBe("2021/10/11")
    expect(parseDate("유통기한: 11/14////")).toBe("2020/11/14")
    expect(parseDate("유통기한: 10/35////")).toBe("error")
  })
})