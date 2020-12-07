import axios from 'axios';
import * as actionCreators from './index';
import { getMockStore } from "../../mock";

const mockStore = getMockStore({})

describe('store/actions/comment', () => {
  afterEach(() => { 
    jest.clearAllMocks() 
  });

  it('should handle getComments', async () => {
    const spyGet = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          resolve({data: {}});
        });
      })
    await mockStore.dispatch(actionCreators.getComments(1));
    expect(spyGet).toHaveBeenCalled();
  });

  it('should handle getComment', async () => {
    const spyGet = jest.spyOn(axios, 'get')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({data: {}});
      });
    })
    await mockStore.dispatch(actionCreators.getComment(1));
    expect(spyGet).toHaveBeenCalled();
  });

  it('should handle createComment', async () => {
    const spyPost = jest.spyOn(axios, 'post')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({data: {}});
      });
    })
    await mockStore.dispatch(actionCreators.createComment(1, {content: 'c'}));
    expect(spyPost).toHaveBeenCalled();
  });

  it('should handle editComment', async () => {
    const spyPut = jest.spyOn(axios, 'put')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({data: {}});
      });
    })
    await mockStore.dispatch(actionCreators.editComment({id:1, content:'c'}));
    expect(spyPut).toHaveBeenCalled();
  });

  it('should handle deleteComment', async () => {
    const spyDelete = jest.spyOn(axios, 'delete')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({data: {}});
      });
    })
    await mockStore.dispatch(actionCreators.deleteComment(1));
    expect(spyDelete).toHaveBeenCalled();
  });


})