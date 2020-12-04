import * as actionTypes from './actionTypes'; 

export const updateCurrentItem_ = (item) => {
    return { type: actionTypes.UPDATE_CURRENT_ITEM, item };
};

export const updateCurrentItem = (item) => {  
    return dispatch => {
      dispatch(updateCurrentItem_(item));
    }; 
};

export const moveItemToList_ = () => {
    return { type: actionTypes.MOVE_ITEM_TO_LIST };
};

export const moveItemToList = () => {  
    return dispatch => {
      dispatch(moveItemToList_())
    }; 
};