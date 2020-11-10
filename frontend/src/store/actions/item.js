import * as actionTypes from './actionTypes'; 
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const getItems_ = (items) => {
    return { type: actionTypes.GET_ITEMS, items: items };
};

export const getItems = () => {  
    return dispatch => {
        return axios.get('/item/')
                    .then(res => dispatch(getItems_(res.data)));
    }; 
};

export const getUserItems_ = (items) => {
    return { type: actionTypes.GET_USER_ITEMS, items: items };
};

export const getUserItems = (user_id) => {  
    return dispatch => {
        return axios.get(`/item/user/${user_id}/`)
                    .then(res => dispatch(getItems_(res.data)));
    }; 
};
