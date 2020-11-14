import articleReducer from "./article";
import * as actionTypes from '../actions/actionTypes';

describe('article reducer', () => {
  it('should return initial state', () => {
    const initialState = articleReducer(undefined, {}); 
    expect(initialState).toEqual({
      articles: [],
      selectedArticle: []
    });
  });

  it('should get article', () => {
    const stubArticle =             {
      "id": 0,
      "author_id": 1,
      "title": "TEST-ARTICLE-TITLE-1",
      "content": "TEST-ARTICLE-CONTENT-1"
    };

    const updateState = articleReducer(undefined, {
      type: actionTypes.GET_ARTICLE,
      target: [stubArticle]
    }); 

    expect(updateState).toEqual({
      articles: [],
      selectedArticle: [stubArticle]
    });
  });

  it('should get every articles', () => {
    const stubArticles = [{
      "id": 0,
      "author_id": 1,
      "title": "TEST-ARTICLE-TITLE-1",
      "content": "TEST-ARTICLE-CONTENT-1"
    },
    {
      "id": 11,
      "author_id": 2,
      "title": "TEST-ARTICLE-TITLE-2",
      "content": "TEST-ARTICLE-CONTENT-2"
    },
    {
      "id": 12,
      "author_id": 1,
      "title": "TEST-ARTICLE-TITLE-3",
      "content": "TEST-ARTICLE-CONTENT-3"
    }];
    const updateState = articleReducer(undefined, {
        type: actionTypes.GET_ALL, 
        articles: stubArticles
    }); 
    expect(updateState).toEqual({
        articles: stubArticles,
        selectedArticle: []
    });
  })
});