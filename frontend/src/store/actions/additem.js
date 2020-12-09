import * as actionTypes from './actionTypes'; 

export const updateItemList_ = (id, item) => {
  return { type: actionTypes.UPDATE_ITEM_LIST, id, item };
};

export const updateItemList = (id, item) => {  
  return dispatch => {
    dispatch(updateItemList_(id, item));
  }; 
};

export const addNewItem_ = (item) => {
  return { type: actionTypes.ADD_NEW_ITEM, item };
}

export const addNewItem = (item) => {
  return dispatch => {
    dispatch(addNewItem_(item));
  }
}

export const resetItemList_ = () => {
  return { type: actionTypes.RESET_ITEM_LIST };
}

export const resetItemList = () => {
  return dispatch => {
    dispatch(resetItemList_());
  }
}
