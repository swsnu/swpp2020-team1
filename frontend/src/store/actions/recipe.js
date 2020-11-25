import * as actionTypes from './actionTypes'; 
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const getRecipes_ = (recipes) => {
    return { type: actionTypes.GET_RECIPES, recipes };
};

export const getRecipes = () => {  
    return dispatch => {
        return axios.get(`/back/recipe/`)
                    .then(res => dispatch(getRecipes_(res.data)))
                    .catch(e => {});
    }; 
};
