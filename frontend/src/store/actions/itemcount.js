import * as actionTypes from './actionTypes'; 
import axios from 'axios';

export const getItemCounts_ = (itemcounts) => {
    return { type: actionTypes.GET_ITEMCOUNTS, itemcounts: itemcounts };
};

export const getItemCounts = () => {  
    return dispatch => {
        return axios.get('/itemcount')
                    .then(res => dispatch(getItemCounts_(res.data)));
    }; 
};

export const editItemCount_ = (itemcount) => {
  return { type: actionTypes.EDIT_ITEMCOUNT, itemcount: itemcount};
}

export const editItemCount = (id, count) => {
  return dispatch => {
      return axios.put(`/item/count/${id}`, count)
                  .then(res => dispatch(editItemCount_(res.data)));
  }
}
