import additemReducer from "./additem";
import * as actionTypes from '../actions/actionTypes';

describe('additem reducer', () => {
  it('should return initial state', () => {
    const initialState = additemReducer(undefined, {}); 
    expect(initialState).toEqual({ resultList: [] });
  });

  it('should update resultList correctly', () => {
    const initialState = {
      resultList: [
        { name: '냉장 서울우유 1L',
          barcode_num: 8801115114154,
          expiration_date: '2020/11/24',
          category_name: '우유',
          category_id: 7,
          count: 4, 
          container: 'freezer' }, 
        { name: '숯불 김밥햄 180g',
          barcode_num: 8801007004426,
          expiration_date: '2020/12/15',
          category_name: '햄',
          category_id: 1,
          count: 3, 
          container: 'fridge' }]
    }

    const stubItem = {
      container: 'fridge'
    };

    const updateState = additemReducer(initialState, {
      type: actionTypes.UPDATE_ITEM_LIST,
      id: 0,
      item: stubItem
    }); 

    expect(updateState.resultList[0].container).toEqual(stubItem.container);
    expect(updateState.resultList[1]).toEqual(initialState.resultList[1]);
  });

  it('should add new item correctly', () => {
    const initialState = {
      resultList: []
    }

    const stubItem = {
      name: '냉장 서울우유 1L',
      barcode_num: 8801115114154,
      expiration_date: '2020/11/24',
      category_name: '우유',
      category_id: 7,
      count: 4, 
      container: 'freezer' 
    };

    const updateState = additemReducer(initialState, {
      type: actionTypes.ADD_NEW_ITEM,
      item: stubItem
    }); 

    expect(updateState.resultList[0]).toEqual(stubItem);
  });

  it('should reset resultList correctly', () => {
    const initialState = {
      resultList: [
        { name: '냉장 서울우유 1L',
          barcode_num: 8801115114154,
          expiration_date: '2020/11/24',
          category_name: '우유',
          category_id: 7,
          count: 4, 
          container: 'freezer' 
        }]
    }


    const updateState = additemReducer(initialState, {
      type: actionTypes.RESET_ITEM_LIST
    }); 

    expect(updateState.resultList).toEqual([]);
  });
});