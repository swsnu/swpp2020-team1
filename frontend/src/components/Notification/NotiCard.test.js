import React from 'react';
import { shallow, mount } from 'enzyme';
import NotiCard from './NotiCard';
import { ListItem, Typography } from '@material-ui/core';

describe('<NotiCard />', () => {
  it('should render without errors', () => {
    const noti = { id: 1, notiType: 'expire', itemName: 'itemName1',
      expirationDate: '2021/12/27', isRead: false, noneed: '1' } 
    const component = mount(
      <NotiCard
        noti={noti}/>);
    const wrapper = component.find(NotiCard);
    expect(wrapper.length).toBe(1)
  });

  it('should render without errors isRead true', () => {
    const noti = { id: 1, notiType: 'expire', itemName: 'itemName1',
      expirationDate: '2020/11/01', isRead: true, noneed: '1' } 
    const component = mount(
      <NotiCard
        noti={noti}/>);
    const wrapper = component.find(NotiCard);
    expect(wrapper.length).toBe(1)
  });

  it('should handle unsupported noti type', () => {
    const noti = { id: 1, notiType: 'unsupported', itemName: 'itemName1',
      expirationDate: '2020/11/27', isRead: false }
    const component = shallow(
      <NotiCard 
        noti={noti}/>);
    const wrapper = component.find('.NotiCardBtn');
    expect(wrapper.length).toBe(1);
  })

  it('should handle click on NotiCard', () => {
    const noti = { id: 1, notiType: 'expire', itemName: 'itemName1',
      expirationDate: '2020/11/27', isRead: false }
      const onReadMock = jest.fn();
    const component = shallow(
      <NotiCard
        noti={noti}
        onRead={onReadMock}/>);
    const wrapper = component.find('.NotiCardBtn');
    expect(wrapper.length).toBe(1);
    wrapper.simulate('click')
    expect(onReadMock).toHaveBeenCalledTimes(1)
  })
});