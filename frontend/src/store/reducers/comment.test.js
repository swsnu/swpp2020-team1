import commentReducer from "./comment";
import * as actionTypes from '../actions/actionTypes';

let stubComments = [
  {
    'id': 1,
    'content': 'c1',
    'author_id': 1,
    'author': 'user1', 
    'recipe_id': 1,
    'date': '2020-11-11'
  },
  {
    'id': 2,
    'content': 'c2',
    'author_id': 2,
    'author': 'user2', 
    'recipe_id': 1,
    'date': '2020-11-11'
  },
]

const stubInitialState = {
  comments: stubComments,
}

describe('comment reducer', () => {
  it('should return initial state', () => {
    const initialState = commentReducer(undefined, {}); 
    expect(initialState).toEqual({
      comments: []
    });
  });

  it('should get all comments', () => {
    const updateState = commentReducer(undefined, {
      type: actionTypes.GET_COMMENTS, 
      comments: stubComments
    }); 
    expect(updateState).toEqual({
      comments: stubComments
    });
  })

  it('should get comment', () => {
    let comment = {'id':1, 'content': 'c3'};
    const updateState = commentReducer(stubInitialState, {
      type: actionTypes.GET_COMMENT, 
      comment: comment
    }); 
    expect(updateState.comments.find(c => c.id === 1)).toEqual(comment);
  })

  it('should add comment', () => {
    const updateState = commentReducer(undefined, {
      type: actionTypes.CREATE_COMMENT,
      comment: {'id':3}
    }); 
    expect(updateState.comments.length).toEqual(1);
  })

  it('should edit comment', () => {
    const updateState = commentReducer(stubInitialState, {
      type: actionTypes.EDIT_COMMENT,
      comment: {'id':1, 'content':'new'}
    });
    expect(updateState.comments.find(c => c.id === 1).content).toEqual('new');
  })

  it('should delete comment', () => {
    const updateState = commentReducer(stubInitialState, {
      type: actionTypes.DELETE_COMMENT,
      comment_id: 1
    });
    expect(updateState.comments.length).toEqual(1);
  })

});