import * as actionTypes from './actionTypes'; 
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const getItems_ = (items) => {
    return { type: actionTypes.GET_ITEMS, items };
};

export const getItems = () => {  
    return dispatch => {
        return axios.get('/back/item/')
                    .then(res => dispatch(getItems_(res.data)))
                    .catch(e => {});
    }; 
};

export const getUserItems_ = (items) => {
    return { type: actionTypes.GET_USER_ITEMS, items };
};

export const getUserItems = (user_id) => {  
    return dispatch => {
        return axios.get(`/back/item/user/${user_id}/`)
                    .then(res => dispatch(getUserItems_(res.data)))
                    .catch(e => {});
    }; 
};

export const addItem_ = (item, itemcount) => {
    return { type: actionTypes.ADD_ITEM, item, itemcount };
};

export const addItem = (item) => {  
    return dispatch => {
        return axios.post(`/back/item/`, item)
                    .then(res => {
                        dispatch(addItem_(res.data.item, res.data.itemcount)); 
                        // console.log(res)
                    })
                    .catch(e => {});
    }; 
};