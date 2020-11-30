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

export const getRecipe_ = (recipe) => {
    return { type: actionTypes.GET_RECIPE, recipe };
}

export const getRecipe = (recipe_id) => {
    return dispatch => {
        return axios.get(`/back/recipe/${recipe_id}/`)
                    .then(res => dispatch(getRecipe_(res.data)))
                    .catch(e => {});
    }
}

export const putRecipe_ = (recipe) => {
    return { type: actionTypes.PUT_RECIPE, recipe };
}

export const putRecipe = (recipe_id, rating) => {
    return dispatch => {
        return axios.put(`/back/recipe/${recipe_id}`, {rating: rating})
                    .then(res => dispatch(putRecipe_(res.data)))
                    .catch(e => {});
    }
}

export const getRatedRecipes_ = (recipeIds) => {
    return { type: actionTypes.GET_RATED_RECIPES, recipeIds }
}

export const getRatedRecipes = () => {
    return dispatch => {
        return axios.get(`/back/recipe/rating/`)
                    .then(res => dispatch(getRatedRecipes_(res.data)))
                    .catch(e => {})
    }
}

