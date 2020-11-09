import * as actionTypes from './actionTypes'; 
import axios from 'axios';

export const getItemCounts_ = (item_id, itemcounts) => {
    return { type: actionTypes.GET_ITEMCOUNTS, item_id, itemcounts };
};

export const getItemCounts = (item_id) => {  
    return dispatch => {
        return axios.get(`/item/${item_id}/count/`)
                    .then(res => dispatch(getItemCounts_(item_id, res.data)));
    }; 
};

export const editItemCount_ = (itemcount) => {
  return { type: actionTypes.EDIT_ITEMCOUNT, itemcount};
}

export const editItemCount = (id, count) => {
  return dispatch => {
      return axios.put(`/item/count/${id}/`, count)
                  .then(res => dispatch(editItemCount_(res.data)));
  }
}
