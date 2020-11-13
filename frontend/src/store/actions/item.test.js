import axios from 'axios';
import * as actionCreators from './index';
import { getMockStore } from "../../mock";

import thunk from 'redux-thunk';
import * as actionTypes from "./actionTypes";
import { createBrowserHistory } from 'history';

import { connectRouter, routerMiddleware } from 'connected-react-router';

const stubArticle = {
  "id": 0,
  "authorId": 1,
  "title": "10 React JS Articles Every Web Developer Should Read",
  "content": "Hello Guys, React or React JS is a JavaScript front-end library from Facebook which lets you create HTML based GUI. It makes the task easier by providing a component-based architecture which was only available to languages like Java and C# before."
}

// ITEM MOCK DB 만든 이후에 실제 정보에 맞게 name 및 category_id 수정 필요
const stubItem = {
  'id': 1,
  'userId': 1,
  'container': 'freezer',
  'barcodeNum': 8801115134237,
  'name': '서울우유 초콜릿200ml', 
  'categoryId': 3
}

const stubItemCounts = {
  'id': 2, 
  'itemId': 1, 
  'expirationDate': '2020/11/31', 
  'count': 3
}

const stubInitialState = {
  article: {
    articles: [stubArticle],
    selectedArticle: []
  },
  item: {
    items: [stubItem],
  },
  itemcount: {
    itemcounts: [stubItemCounts],
  },
}

describe('store/actions/item', () => {
  let mockStore;
  beforeEach(() => {
    mockStore = getMockStore(stubInitialState);
  })
  afterEach(() => { 
    jest.clearAllMocks() 
  });

  it('getItems should fetch items correctly', (done) => {
    const spyAxiosGet = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: [stubItem]
          };
          resolve(result);
          reject();
        });
      })

      mockStore.dispatch(actionCreators.getItems()).then(() => {
        expect(spyAxiosGet).toHaveBeenCalledTimes(1);
        const state = mockStore.getState();
        expect(state.item.items).toEqual([stubItem]);
        done();
      });
  });
})