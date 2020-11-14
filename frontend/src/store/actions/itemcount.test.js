import axios from 'axios';
import * as actionCreators from './index';
import { getMockStore } from "../../mock";
import { createBrowserHistory } from 'history';

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
  'barcodeNum': "8801115134237",
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

describe('store/actions/itemcount', () => {
  let mockStore;
  beforeEach(() => {
    mockStore = getMockStore(stubInitialState);
  })
  afterEach(() => { 
    jest.clearAllMocks() 
  });

  it('getItemCounts should fetch itemcounts correctly', (done) => {
    const spyAxiosGet = jest.spyOn(axios, 'get')
      .mockImplementation(url => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: [stubItemCounts]
          };
          resolve(result);
          reject();
        });
      })

    mockStore.dispatch(actionCreators.getItemCounts(stubItem.id)).then(() => {
      expect(spyAxiosGet).toHaveBeenCalledTimes(1);
      const state = mockStore.getState();
      expect(state.itemcount.itemcounts).toEqual([stubItemCounts]);
      done();
    });
  });

  // export const editItemCount_ = (id, is_deleted, itemcount) => {
  //   return { type: actionTypes.EDIT_ITEMCOUNT, id, is_deleted, itemcount};
  // }
  
  // export const editItemCount = (id, count) => {
  //   return dispatch => {
  //       return axios.put(`/item/count/${id}/`, {'count': count})
  //                   .then(res => {
  //                     dispatch(editItemCount_(id, res.data.is_deleted, res.data.itemcount)); 
  //                     console.log("data:",res.data)});
  //   }
  // }
  it('editItemCount should edit itemcount correctly', (done) => {
    const spyAxiosPut = jest.spyOn(axios, 'put')
      .mockImplementation((url, count) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: {
              is_deleted: false,
              itemcount: [stubItemCounts]
            }
          };
          resolve(result);
        });
      })

    const mockCount = {'count': 10};
    mockStore.dispatch(actionCreators.editItemCount(stubItemCounts.id, mockCount))
      .then(() => {
        expect(spyAxiosPut).toHaveBeenCalledTimes(1);
        // const state = mockStore.getState();
        // expect(state.itemcount.itemcounts).toEqual([stubItemCounts]);
        done();
      });
});

})