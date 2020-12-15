import React from 'react';
import { shallow } from 'enzyme';
import parseDate from './DateParser';

describe('parseDate()', () => {
  it('should recieve correct values', () => {
    expect(parseDate("exp: 31.10.2021//")).toBe("2021/10/31")
    expect(parseDate("2021.10.11////")).toBe("2021/10/11")
    expect(parseDate("EXP2021.02.14..")).toBe("2021/02/14")
    expect(parseDate("유통기한: 11/14////")).toBe("2020/11/14")
    expect(parseDate("유통기한: 10/35////")).toBe("error")
    expect(parseDate("유통기한: 12/31.....11/30////")).toBe("2020/12/31")
  })
})