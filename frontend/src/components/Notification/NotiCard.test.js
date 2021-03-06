import React from 'react';
import { shallow, mount } from 'enzyme';
import NotiCard from './NotiCard';

describe('<NotiCard />', () => {
  it('should render without errors (expire)', () => {
    const noti = { id: 1, notiType: 'expire', itemName: 'itemName1',
      expirationDate: '2021/12/27', isRead: false, noneed: '1' } 
    const component = mount(
      <NotiCard
        noti={noti}
        onRead={jest.fn()}/>);
    const wrapper = component.find(NotiCard);
    expect(wrapper.length).toBe(1)
    const wrapper2 = component.find('.NotiListItem').at(0);
    wrapper2.simulate('click')
  });
  
  it('should render without errors (buy_item)', () => {
    const noti = { id: 1, notiType: 'buy_item', itemName: 'itemName1',
      expirationDate: '2021/12/27', isRead: false, noneed: '1' }
    const component = mount(
      <NotiCard
        noti={noti}/>);
    const wrapper = component.find(NotiCard);
    expect(wrapper.length).toBe(1)
  });
  
  it('should handle click purchaseLink', () => {
    const noti = { id: 1, notiType: 'buy_item', itemName: 'itemName1',
      expirationDate: '2021/12/27', isRead: false, noneed: '1' }
    let spyOpen = jest.spyOn(window, 'open').mockImplementation(() => { return () => {}; });
    const component = mount(
      <NotiCard
        onRead={jest.fn()}
        noti={noti}/>);
    const linkWrapper = component.find('.purchaseLink')
    linkWrapper.simulate('click')
    expect(spyOpen).toHaveBeenCalledTimes(1);
  });

  it('should render without errors (recipe)', () => {
    const noti = { id: 1, notiType: 'recipe', itemName: 'itemName1',
      expirationDate: '2021/12/27', isRead: true, noneed: '1' } 
    const component = mount(
      <NotiCard
        noti={noti}/>);
    const wrapper = component.find(NotiCard);
    expect(wrapper.length).toBe(1)
  });

  it('should render without errors isRead true (expire)', () => {
    const noti = { id: 1, notiType: 'expire', itemName: 'itemName1',
      expirationDate: '2020/11/01', isRead: true, noneed: '1' } 
    const component = mount(
      <NotiCard
        noti={noti}/>);
    const wrapper = component.find(NotiCard);
    expect(wrapper.length).toBe(1)
  });

  it('should render without errors isRead true (buy_item)', () => {
    const noti = { id: 1, notiType: 'buy_item', itemName: 'itemName1',
      expirationDate: '2020/11/01', isRead: true, noneed: '1' } 
    const component = mount(
      <NotiCard
        noti={noti}/>);
    const wrapper = component.find(NotiCard);
    expect(wrapper.length).toBe(1)
  });

  it('should render date string (buy_item)', () => {
    let noti = { id: 1, notiType: 'buy_item', itemName: 'itemName1',
      expirationDate: '2020/12/25', elapsedDays: 2, isRead: false, noneed: '1' } 
    mount(
      <NotiCard
        noti={noti}/>);
    noti = { id: 1, notiType: 'buy_item', itemName: 'itemName1',
      expirationDate: '2020/12/25', elapsedDays: 1, isRead: false, noneed: '1' } 
    mount(
      <NotiCard
        noti={noti}/>);
    noti = { id: 1, notiType: 'buy_item', itemName: 'itemName1',
      expirationDate: '2020/12/25', elapsedDays: 0, isRead: false, noneed: '1' } 
    mount(
      <NotiCard
        noti={noti}/>);
    noti = { id: 1, notiType: 'buy_item', itemName: 'itemName1',
      expirationDate: '2020/12/25', elapsedDays: -1, isRead: false, noneed: '1' } 
  });

  it('should render date string (expire)', () => {
    let noti = { id: 1, notiType: 'expire', itemName: 'itemName1',
      expirationDate: '2020/12/25', elapsedDays: 2, isRead: false, noneed: '1' } 
    mount(
      <NotiCard
        noti={noti}/>);
    noti = { id: 1, notiType: 'expire', itemName: 'itemName1',
      expirationDate: '2020/12/25', elapsedDays: 1, isRead: false, noneed: '1' } 
    mount(
      <NotiCard
        noti={noti}/>);
    noti = { id: 1, notiType: 'expire', itemName: 'itemName1',
      expirationDate: '2020/12/25', elapsedDays: 0, isRead: false, noneed: '1' } 
    mount(
      <NotiCard
        noti={noti}/>);
    noti = { id: 1, notiType: 'expire', itemName: 'itemName1',
      expirationDate: '2020/12/25', elapsedDays: -1, isRead: false, noneed: '1' } 
  });

  it('should handle unsupported noti type', () => {
    const noti = { id: 1, notiType: 'unsupported', itemName: 'itemName1',
      expirationDate: '2020/11/27', isRead: false }
    const component = shallow(
      <NotiCard 
        noti={noti}/>);
    const wrapper = component.find('.NotiListItem');
    expect(wrapper.length).toBe(0);
  })

  it('should handle click on NotiCard', () => {
    const noti = { id: 1, notiType: 'expire', itemName: 'itemName1',
      expirationDate: '2020/11/27', isRead: false }
      const onReadMock = jest.fn();
    const component = shallow(
      <NotiCard
        noti={noti}
        onRead={onReadMock}/>);
    const wrapper = component.find('.NotiListItem');
    expect(wrapper.length).toBe(1);
    wrapper.simulate('click')
    expect(onReadMock).toHaveBeenCalledTimes(1)
  })
});