import * as actionTypes from '../actions/actionTypes'; 

const initialState = {
    comments: [],
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_COMMENTS:
            return {...state, comments: action.comments};
        
        case actionTypes.GET_COMMENT:
            return {...state, comments: state.comments.map(comm => {
              if(comm.id === action.comment.id) return action.comment;
              else return comm;
            })};
        
        case actionTypes.CREATE_COMMENT:
            return {...state, comments: state.comments.concat(action.comment)};
        
        case actionTypes.EDIT_COMMENT:
            return {...state, comments: state.comments.map(comm => {
                if(comm.id === action.comment.id) return action.comment;
                else return comm;
            })};

        case actionTypes.DELETE_COMMENT:
            return {...state, comments: state.comments.filter(comm => comm.id !== action.comment_id)};

        default:
            break;
    }
    return state;
}


export default reducer;