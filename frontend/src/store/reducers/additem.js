import * as actionTypes from '../actions/actionTypes';

const defaultResult = {
  name: '',
  container: 'freezer',
  category_id: 0,
  category_name: '기타',
  barcode_num: '',
  expiration_date: '',
  count: 1
}
const initialState = {
  currentResult: defaultResult,
  resultList: []
}

const additemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_CURRENT_ITEM:
      return { ...state, currentResult: { ...state.currentResult, ...action.item }}
    case actionTypes.MOVE_ITEM_TO_LIST:
      const receivedResult = state.currentResult;
      return {...state, currentResult: defaultResult, resultList: [ ...state.resultList, receivedResult] };
    // After adding item, we always redirect to main page where we send GET request for items & itemcounts
    // Therefore we don't have to add the items to the state here
    default:
      break;
  }
  return state;
}

export default additemReducer;