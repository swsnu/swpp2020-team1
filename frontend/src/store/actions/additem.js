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

export const resetItemList_ = () => {
  return { type: actionTypes.RESET_ITEM_LIST };
}

export const resetItemList = () => {
  return dispatch => {
    dispatch(resetItemList_());
  }
}

export const setDefaultContainer_ = (container) => {
  return { type: actionTypes.SET_DEFAULT_CONTAINER, container };
}

export const setDefaultContainer = (container) => {
  return dispatch => {
    dispatch(setDefaultContainer_(container));
  }
}
