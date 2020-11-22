import * as actionTypes from './actionTypes'; 
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const getUserNotiList_ = (user_id, notifications) => {
    return { type: actionTypes.GET_USER_NOTI, user_id, notifications };
};

export const getUserNotiList = (user_id) => {  
    return dispatch => {
        return axios.get(`/back/noti/user/${user_id}/`)
                    .then(res => dispatch(getUserNotiList_(user_id, res.data)))
                    .catch(e => {});
    }; 
};

export const setIsRead_ = (id) => {
  return { type: actionTypes.SET_ISREAD, id };
}

export const setIsRead = (id, count) => {
  return dispatch => {
      return axios.put(`/back/noti/${id}/`)
                  .then(res => {
                    dispatch(setIsRead_(id)); 
                  })
                  .catch(e => {});
  }
}
