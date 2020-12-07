import axios from 'axios';
import * as actionCreators from './index';
import { getMockStore } from "../../mock";

const mockStore = getMockStore({})

describe('store/actions/recipe', () => {
  afterEach(() => { 
    jest.clearAllMocks() 
  });

  it('should handle getRecipes', async () => {
    let spyGet = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          resolve({data: {}});
        });
      })
    await mockStore.dispatch(actionCreators.getRecipes());
    expect(spyGet).toHaveBeenCalled();

    // on error...
    spyGet = jest.spyOn(axios, 'get')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        reject();
      });
    })
    jest.clearAllMocks();
    await mockStore.dispatch(actionCreators.getRecipes());
    expect(spyGet).toHaveBeenCalled();
  });

  it('should handle searchRecipe', async () => {
    let spyPost = jest.spyOn(axios, 'post')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({data: {}});
      });
    })
    await mockStore.dispatch(actionCreators.searchRecipes());
    expect(spyPost).toHaveBeenCalled();

    // on error...
    spyPost = jest.spyOn(axios, 'post')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        reject();
      });
    })
    jest.clearAllMocks();
    await mockStore.dispatch(actionCreators.searchRecipes());
    expect(spyPost).toHaveBeenCalled();
  });

  it('should handle getRecipe', async () => {
    let spyGet = jest.spyOn(axios, 'get')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({data: {}});
      });
    })
    await mockStore.dispatch(actionCreators.getRecipe(1));
    expect(spyGet).toHaveBeenCalled();

    // on error...
    spyGet = jest.spyOn(axios, 'get')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        reject();
      });
    })
    jest.clearAllMocks();
    await mockStore.dispatch(actionCreators.getRecipe());
    expect(spyGet).toHaveBeenCalled();
  });

  it('should handle putRecipe', async () => {
    let spyPut = jest.spyOn(axios, 'put')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({data: {}});
      });
    })
    await mockStore.dispatch(actionCreators.putRecipe(1, 3.0));
    expect(spyPut).toHaveBeenCalled();

    // on error...
    spyPut = jest.spyOn(axios, 'put')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        reject();
      });
    })
    jest.clearAllMocks();
    await mockStore.dispatch(actionCreators.putRecipe(1, 3.0));
    expect(spyPut).toHaveBeenCalled();
  });

  it('should handle getRatedRecipe', async () => {
    let spyGet = jest.spyOn(axios, 'get')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        resolve({data: {}});
      });
    })
    await mockStore.dispatch(actionCreators.getRatedRecipes());
    expect(spyGet).toHaveBeenCalled();

    // on error...
    spyGet = jest.spyOn(axios, 'get')
    .mockImplementation(url => {
      return new Promise((resolve, reject) => {
        reject();
      });
    })
    jest.clearAllMocks();
    await mockStore.dispatch(actionCreators.getRatedRecipes());
    expect(spyGet).toHaveBeenCalled();
  });



})