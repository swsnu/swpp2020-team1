import axios from 'axios';
import * as actionCreators from './index';
import { getMockStore } from "../../mock";

const mockStore = getMockStore({})

describe('store/actions/comment', () => {
  afterEach(() => { 
    jest.clearAllMocks() 
  });

  it('should handle getComments', async () => {
    let spyGet = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          resolve({data: {}});
        });
      })
    await mockStore.dispatch(actionCreators.getComments(1));
    expect(spyGet).toHaveBeenCalled();

    // on error...
    spyGet = jest.spyOn(axios, 'get')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        reject();
      });
    })
    jest.clearAllMocks();
    await mockStore.dispatch(actionCreators.getComments(1));
    expect(spyGet).toHaveBeenCalled();
  });

  it('should handle getComment', async () => {
    let spyGet = jest.spyOn(axios, 'get')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({data: {}});
      });
    })
    await mockStore.dispatch(actionCreators.getComment(1));
    expect(spyGet).toHaveBeenCalled();

    // on error...
    spyGet = jest.spyOn(axios, 'get')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        reject();
      });
    })
    jest.clearAllMocks();
    await mockStore.dispatch(actionCreators.getComment(1));
    expect(spyGet).toHaveBeenCalled();
  });

  it('should handle createComment', async () => {
    let spyPost = jest.spyOn(axios, 'post')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({data: {}});
      });
    })
    await mockStore.dispatch(actionCreators.createComment(1, {content: 'c'}));
    expect(spyPost).toHaveBeenCalled();


    // on error...
    spyPost = jest.spyOn(axios, 'post')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        reject();
      });
    })
    jest.clearAllMocks();
    await mockStore.dispatch(actionCreators.createComment(1, {content: 'c'}));
    expect(spyPost).toHaveBeenCalled();
  });

  it('should handle editComment', async () => {
    let spyPut = jest.spyOn(axios, 'put')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({data: {}});
      });
    })
    await mockStore.dispatch(actionCreators.editComment({id:1, content:'c'}));
    expect(spyPut).toHaveBeenCalled();


    // on error...
    spyPut = jest.spyOn(axios, 'put')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        reject();
      });
    })
    jest.clearAllMocks();
    await mockStore.dispatch(actionCreators.editComment({id:1, content:'c'}));
    expect(spyPut).toHaveBeenCalled();
  });

  it('should handle deleteComment', async () => {
    let spyDelete = jest.spyOn(axios, 'delete')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({data: {}});
      });
    })
    await mockStore.dispatch(actionCreators.deleteComment(1));
    expect(spyDelete).toHaveBeenCalled();


    // on error...
    spyDelete = jest.spyOn(axios, 'delete')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        reject();
      });
    })
    jest.clearAllMocks();
    await mockStore.dispatch(actionCreators.deleteComment(1));
    expect(spyDelete).toHaveBeenCalled();
  });


})