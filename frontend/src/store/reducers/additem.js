import * as actionTypes from '../actions/actionTypes';

const initialState = {
  resultList: []
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
      return { ...state, resultList: [ ...state.resultList, action.item ]};
    case actionTypes.RESET_ITEM_LIST:
      return { ...state, resultList: [] };
    default:
      break;
  }
  return state;
}

export default additemReducer;