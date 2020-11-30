import * as actionTypes from './actionTypes'; 
import axios from 'axios';


export const getComments_ = (comments) => {
    return { type: actionTypes.GET_COMMENTS, comments };
};

export const getComments = (recipe_id) => {  
    return dispatch => {
        return axios.get(`/back/${recipe_id}/comment/`)
                    .then(res => dispatch(getComments_(res.data)));
    }; 
};

export const getComment_ = (comment) => {
    return { type: actionTypes.GET_COMMENT, comment};
}

export const getComment = (comment_id) => {
    return dispatch => {
        return axios.get(`/back/comment/${comment_id}/`)
                    .then(res => dispatch(getComment_(res.data)));
    }
}

export const createComment_ = (comment) => {
    return { type: actionTypes.CREATE_COMMENT, comment};
}

// comment: {content: 'ccc'}
export const createComment = (recipe_id, comment) => {
    return dispatch => {
        return axios.post(`/back/${recipe_id}/comment/`, comment)
                    .then(res => dispatch(createComment_(res.data)));
    }
}

export const editComment_ = (comment) => {
    return { type: actionTypes.EDIT_COMMENT, comment};
}

// comment: {id: 1, content: 'ccc'}
export const editComment = (comment) => {
    return dispatch => {
        return axios.put(`/back/comment/${comment.id}/`, comment)
                    .then(res => dispatch(editComment_(res.data)));
    }
}

export const deleteComment_ = (comment_id) => {
    return { type: actionTypes.DELETE_COMMENT, comment_id};
}

export const deleteComment = (comment_id) => {
    return dispatch => {
        return axios.delete(`/back/comment/${comment_id}/`)
                    .then(res => dispatch(deleteComment_(comment_id)));
    }
}
