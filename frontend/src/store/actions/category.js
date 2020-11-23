import * as actionTypes from './actionTypes'; 
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const getCategories_ = (categories) => {
    return { type: actionTypes.GET_CATEGORIES, categories };
};

export const getCategories = () => {  
    return dispatch => {
        return axios.get(`/back/category/`)
                    .then(res => dispatch(getCategories_(res.data)))
                    .catch(e => {});
    }; 
};