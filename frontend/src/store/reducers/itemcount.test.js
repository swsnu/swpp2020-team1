import itemcountReducer from "./itemcount";
import * as actionTypes from '../actions/actionTypes';

describe('itemcount reducer', () => {
  it('should return initial state', () => {
    const initialState = itemcountReducer(undefined, {}); 
    expect(initialState).toEqual({
      itemcounts: []
    });
  });

  it('should get every itemcounts', () => {
    const stubItemCounts = [{
      'id': 1, 
      'item_id': 1, 
      'expirationDate': '20201231', 
      'count': 2
    },
    {
      'id': 2, 
      'item_id': 2, 
      'expirationDate': '20201123', 
      'count': 4
    }];
    const updateState = itemcountReducer({
      itemcounts: stubItemCounts 
    }, {
      type: actionTypes.GET_ITEMCOUNTS, 
      item_id: 1,
      itemcounts: {
        'id': 1, 
        'item_id': 1, 
        'expirationDate': '20201231', 
        'count': 3
      } 
    }); 

    expect(updateState).toEqual({
      itemcounts: [{
        'id': 2, 
        'item_id': 2, 
        'expirationDate': '20201123', 
        'count': 4
      }, {
        'id': 1, 
        'item_id': 1, 
        'expirationDate': '20201231', 
        'count': 3 
      }]
    });
  })

  it('should delete itemcounts when is_deleted is true', () => {
    const stubItemCounts = [{
      'id': 1, 
      'itemId': 1, 
      'expirationDate': '20201231', 
      'count': 2
    },
    {
      'id': 2, 
      'itemId': 2, 
      'expirationDate': '20201123', 
      'count': 4
    }];
    const updateState = itemcountReducer({
      itemcounts: stubItemCounts  
    }, {
      type: actionTypes.EDIT_ITEMCOUNT,
      is_deleted: true,
      id: 2
    }); 

    expect(updateState).toEqual({
      itemcounts: [stubItemCounts[0]]
    });
  })

  it('should edit itemcounts when is_deleted is false', () => {
    const stubItemCounts = [{
      'id': 1, 
      'itemId': 1, 
      'expirationDate': '20201231', 
      'count': 2
    },
    {
      'id': 2, 
      'itemId': 2, 
      'expirationDate': '20201123', 
      'count': 4
    }];
    const updateState = itemcountReducer({
      itemcounts: stubItemCounts  
    }, {
      type: actionTypes.EDIT_ITEMCOUNT,
      is_deleted: false,
      id: 2,
      itemcounts:  {
        'id': 2, 
        'itemId': 2, 
        'expirationDate': '20201123', 
        'count': 10
      } 
    });

    expect(updateState).toEqual({
      itemcounts: [{
        'id': 1, 
        'itemId': 1, 
        'expirationDate': '20201231', 
        'count': 2
      },{
        'id': 2, 
        'itemId': 2, 
        'expirationDate': '20201123', 
        'count': 10
      } ]
    });
  })

});