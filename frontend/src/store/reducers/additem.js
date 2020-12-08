import * as actionTypes from '../actions/actionTypes';

const defaultResult = {
  name: '',
  container: 'freezer',
  category_id: 0,
  category_name: '기타',
  barcode_num: '',
  expiration_date: new Date(Date.now()),
  count: 1
}
const initialState = {
  defaultResult,
  resultList: [defaultResult]
}

const additemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_DEFAULT_CONTAINER:
      return { ...state, defaultResult: { ...state.defaultResult, container: action.container }}
    case actionTypes.UPDATE_ITEM_LIST:
      const changedResultList = state.resultList.map((item, idx) => {
        if(action.id === idx) {
          return { ...state.resultList[idx], ...action.item };
        }
        return item;
      })
      return { ...state, resultList: changedResultList };
    case actionTypes.ADD_NEW_ITEM:
      return { ...state, resultList: [ ...state.resultList, state.defaultResult ]};
    case actionTypes.RESET_ITEM_LIST:
      return { ...state, resultList: [state.defaultResult] };
    default:
      break;
  }
  return state;
}

export default additemReducer;