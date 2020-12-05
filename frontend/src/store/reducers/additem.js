import * as actionTypes from '../actions/actionTypes';

const defaultResult = {
  name: '',
  container: 'freezer',
  category_id: 0,
  category_name: '기타',
  barcode_num: '',
  expiration_date: Date.now(),
  count: 1
}
const initialState = {
  resultList: [defaultResult]
}

const additemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_ITEM_LIST:
      const changedResultList = state.resultList.map((item, idx) => {
        if(action.id === idx) {
          return { ...state.resultList[idx], ...action.item };
        }
        return item;
      })
      return { ...state, resultList: changedResultList };
    case actionTypes.ADD_NEW_ITEM:
      return { ...state, resultList: [ ...state.resultList, defaultResult ]};
    default:
      break;
  }
  return state;
}

export default additemReducer;