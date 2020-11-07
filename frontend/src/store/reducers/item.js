import * as actionTypes from '../actions/actionTypes';

const initialState = {
  items: [
    {'id': 1, 'user_id': 1, 'container': 'freezer', 'barcode_num': 100, 'name': 'steak', 'category_id': 1},
    {'id': 2, 'user_id': 1, 'container': 'freezer', 'barcode_num': 101, 'name': 'chicken', 'category_id': 2},
    {'id': 3, 'user_id': 1, 'container': 'fridge', 'barcode_num': 102, 'name': 'egg', 'category_id': 3},
    {'id': 4, 'user_id': 1, 'container': 'fridge', 'barcode_num': 103, 'name': 'kimchi', 'category_id': 4},
    {'id': 5, 'user_id': 1, 'container': 'shelf', 'barcode_num': 104, 'name': 'par', 'category_id': 5},
    {'id': 6, 'user_id': 1, 'container': 'shelf', 'barcode_num': 105, 'name': 'apple', 'category_id': 6},
    {'id': 7, 'user_id': 1, 'container': 'shelf', 'barcode_num': 106, 'name': 'bread', 'category_id': 7},
  ],
}

const itemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ITEMS:
      return {...state, items: action.items};
    default:
      break;
  }
  return state;
}

export default itemReducer;