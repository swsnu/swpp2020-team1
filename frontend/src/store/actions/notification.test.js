import axios from 'axios';
import * as actionCreators from './index';
import { getMockStore } from "../../mock";

const mockStore = getMockStore({})

describe('store/actions/notification', () => {
  afterEach(() => { 
    jest.clearAllMocks() 
  });

  it('should handle getUserNotiList', async () => {
    let spyGet = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          resolve({data: {}});
        });
      })
    await mockStore.dispatch(actionCreators.getUserNotiList());
    expect(spyGet).toHaveBeenCalled();

    // on error...
    spyGet = jest.spyOn(axios, 'get')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        reject();
      });
    })
    jest.clearAllMocks();
    await mockStore.dispatch(actionCreators.getUserNotiList());
    expect(spyGet).toHaveBeenCalled();
  });

  it('should handle setIsRead', async () => {
    let spyPut = jest.spyOn(axios, 'put')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({data: {}});
      });
    })
    await mockStore.dispatch(actionCreators.setIsRead(1));
    expect(spyPut).toHaveBeenCalled();

    // on error...
    spyPut = jest.spyOn(axios, 'put')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        reject();
      });
    })
    jest.clearAllMocks();
    await mockStore.dispatch(actionCreators.setIsRead(1));
    expect(spyPut).toHaveBeenCalled();
  });
})