import axios from 'axios';
import * as actionCreators from './index';
import { getMockStore } from "../../mock";

const mockStore = getMockStore({})

describe('store/actions/category', () => {
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
    await mockStore.dispatch(actionCreators.getCategories());
    expect(spyGet).toHaveBeenCalled();

    // on error...
    spyGet = jest.spyOn(axios, 'get')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        reject();
      });
    })
    jest.clearAllMocks();
    await mockStore.dispatch(actionCreators.getCategories());
    expect(spyGet).toHaveBeenCalled();
  });
})