import * as actionTypes from './actionTypes'; 
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const getItemCounts_ = (item_id, itemcounts) => {
    return { type: actionTypes.GET_ITEMCOUNTS, item_id, itemcounts };
};

export const getItemCounts = (item_id) => {  
    return dispatch => {
        return axios.get(`/back/item/${item_id}/count/`)
                    .then(res => dispatch(getItemCounts_(item_id, res.data)))
                    .catch(e => {});
    }; 
};

export const editItemCount_ = (id, is_deleted, itemcount) => {
  return { type: actionTypes.EDIT_ITEMCOUNT, id, is_deleted, itemcount};
}

export const editItemCount = (id, count) => {
  return dispatch => {
      return axios.put(`/back/item/count/${id}/`, {'count': count})
                  .then(res => {
                    dispatch(editItemCount_(id, res.data.is_deleted, res.data.itemcount)); 
                    // console.log("data:",res.data)
                  })
                  .catch(e => {});
  }
}
