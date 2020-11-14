import itemReducer from "./item";
import * as actionTypes from '../actions/actionTypes';

describe('item reducer', () => {
  it('should return initial state', () => {
    const initialState = itemReducer(undefined, {}); 
    expect(initialState).toEqual({
      items: []
    });
  });

  it('should get every items', () => {
    const stubItems = [{
      'id': 1,
      'userId': 1,
      'container': 'freezer',
      'barcodeNum': "8801115134237",
      'name': '서울우유 초콜릿200ml', 
      'categoryId': 3
    },
    {
      'id': 2,
      'userId': 2,
      'container': 'shelf',
      'barcodeNum': "32342300000",
      'name': 'TEST-ITEM', 
      'categoryId': 4
    }];
    const updateState = itemReducer(undefined, {
      type: actionTypes.GET_ITEMS, 
      items: stubItems
    }); 
    expect(updateState).toEqual({
      items: stubItems
    });
  })

  it('should get every user items', () => {
    const stubUserItems = [{
      'id': 1,
      'userId': 1,
      'container': 'freezer',
      'barcodeNum': "8801115134237",
      'name': '서울우유 초콜릿200ml', 
      'categoryId': 3
    },
    {
      'id': 2,
      'userId': 1,
      'container': 'shelf',
      'barcodeNum': "32342300000",
      'name': 'TEST-ITEM', 
      'categoryId': 4
    }];
    const updateState = itemReducer(undefined, {
      type: actionTypes.GET_USER_ITEMS, 
      items: stubUserItems
    }); 
    expect(updateState).toEqual({
      items: stubUserItems
    });
  })

  it('should add item', () => {
    const updateState = itemReducer(undefined, {
      type: actionTypes.ADD_ITEM
    }); 
    expect(updateState).toEqual({
      items: []
    });
  })
});