import * as actionTypes from './actionTypes'; 

export const updateItemList_ = (id, item) => {
  return { type: actionTypes.UPDATE_ITEM_LIST, id, item };
};

export const updateItemList = (id, item) => {  
  return dispatch => {
    dispatch(updateItemList_(id, item));
  }; 
};

export const addNewItem_ = () => {
  return { type: actionTypes.ADD_NEW_ITEM };
}

export const addNewItem = () => {
  return dispatch => {
    dispatch(addNewItem_());
  }
}

