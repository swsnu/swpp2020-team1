import React from 'react';
import axios from 'axios';
import { shallow, mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { createMount } from '@material-ui/core/test-utils';

import MainPage from './MainPage';
import { getMockStore } from '../../mock';
import { history } from '../../store/store';


import ItemContainer from '../ItemContainer/ItemContainer';
import * as actionCreators from '../../store/actions/index';
import * as userActionCreators from '../../store/actions/user';
import * as itemActionCreators from '../../store/actions/item';
import * as itemcountActionCreators from '../../store/actions/itemcount';
import * as notiActionCreators from '../../store/actions/notification';
import * as recipeActionCreators from '../../store/actions/recipe';
import Logout from '../Header/LogOut';
import Item from '../../components/Item/Item';

jest.mock('../ItemContainer/ItemContainer', () => jest.fn())
jest.mock('../../components/Item/Item', () => jest.fn())

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

const crypto = require('crypto');

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length)
  }
});

const stubInitialState = {
  item: {
    items: [  
      {'id': 1, 'user_id': 2, 'container': 'freezer', 'barcode_num': 100, 'name': 'steak', 'category_id': 1},
      {'id': 2, 'user_id': 2, 'container': 'freezer', 'barcode_num': 101, 'name': 'chicken', 'category_id': 2},
      {'id': 3, 'user_id': 2, 'container': 'freezer', 'barcode_num': 102, 'name': 'egg', 'category_id': 3},
      {'id': 4, 'user_id': 2, 'container': 'fridge', 'barcode_num': 103, 'name': 'kimchi', 'category_id': 4},
      {'id': 5, 'user_id': 2, 'container': 'shelf', 'barcode_num': 104, 'name': 'par', 'category_id': 5},
      {'id': 6, 'user_id': 2, 'container': 'shelf', 'barcode_num': 105, 'name': 'apple', 'category_id': 6},
      {'id': 7, 'user_id': 2, 'container': 'shelf', 'barcode_num': 106, 'name': 'bread', 'category_id': 7},
    ],
  },
  itemcount: {
    itemcounts: [
      {'id': 1, 'item_id': 1, 'expiration_date': '20201231', 'count': 2},
      {'id': 2, 'item_id': 1, 'expiration_date': '20201231', 'count': 1},
      {'id': 3, 'item_id': 2, 'expiration_date': '20201231', 'count': 3},
      {'id': 4, 'item_id': 3, 'expiration_date': '20201231', 'count': 1},
      {'id': 5, 'item_id': 4, 'expiration_date': '20201231', 'count': 1},
    ],
  },
  notification: {
    notifications: [{
      id: 1,
      noti_type: "expire",
      is_read: true,
      expire_date: "2020/12/30",
      item_count_id: 1,
      itemName: "milk",
      category: 1,
    },{
      id: 2,
      noti_type: "buy_item",
      is_read: true,
      expire_date: "2020/12/29",
      item_count_id: 2,
      itemName: "chocolate",
      category: 2,
    }],
  },
  user:{
    login: {
      status: 'INIT'
    },
    register: {
      status: 'INIT',
      error: -1
    },
    status: {
      valid: false,
      isLoggedIn: false,
      currentUser: ''
    }
  }
};

const mockStore = getMockStore(stubInitialState);

describe('<MainPage />', () => {
  let mount;

  beforeAll(() => {
    mount = createMount();
  });
  afterAll(() => {
    mount.cleanUp();
  });


  afterEach(() => {jest.clearAllMocks()})
  let props;
  let mocked = jest.fn();
  let mockMainPage;
  let spyOnGetUserItems, spyOnGetItemCounts, spyOnGetUserNotiList, spyOnSetIsRead, spyOnSearchRecipes, spyOnLoginCheck; 
  beforeEach(async () => {
    ItemContainer.mockImplementation(props => {
      return (
        <div className="spyItemContainer">
        </div>
      );
    })

    Item.mockImplementation(props => {
      return (
        <div className="spyItem">
        </div>
      );
    })

    props = {
      isUnreadNotiExists: false,
      openDialog: false,
      currentHeight: 1280,
      currentWidth: 720,
      notifications: [],
      selectedItemIds: [],
      selectedCuisine: null,
      mode: "normal",
      clicked: false,
      history: history
    }
    window.alert = mocked;

    spyOnGetUserItems = jest.spyOn(itemActionCreators, 'getUserItems')
      .mockImplementation(()=> {return dispatch => {}; });
    spyOnGetItemCounts = jest.spyOn(itemcountActionCreators, 'getItemCounts')
      .mockImplementation(()=> {return dispatch => {}; });
    spyOnGetUserNotiList = jest.spyOn(notiActionCreators, 'getUserNotiList')
      .mockImplementation(()=> {return dispatch => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 201
          };
          resolve(result);
        });
      }; });
    spyOnSetIsRead = jest.spyOn(notiActionCreators, 'setIsRead')
      .mockImplementation(()=> {return dispatch => {}; });
    spyOnSearchRecipes = jest.spyOn(recipeActionCreators, 'searchRecipes')
      .mockImplementation(()=> {return dispatch => {}; });
    spyOnLoginCheck = jest.spyOn(userActionCreators, 'loginCheckRequest')
      .mockImplementation(()=> {return dispatch => {}; });

    mockMainPage = (
      <Provider store={mockStore}>
      <ConnectedRouter history={history}>
        <MainPage {...props}/>
      </ConnectedRouter>
    </Provider>
    );
  })

  it('should render well', async () => {
    const spyAxiosGet = jest.spyOn(axios, 'get')
    .mockImplementation((url, user) => {
      return new Promise((resolve, reject) => {
        const result = {
          status: 400,
          data : {
            username: 'TEST-USER'
          }
        };
        reject(result);
      });
    })

    const component = mount(mockMainPage);
    const mainPage = component.find('.MainPage');
    await flushPromises();
    expect(component.find('.MainPage').length).toBe(1);
    expect(mainPage.length).toBe(1);
    expect(spyAxiosGet).toHaveBeenCalled();
    expect(spyOnGetUserItems).toHaveBeenCalled();
    expect(spyOnGetItemCounts).toHaveBeenCalled();
  })

  it('should handle onClickNotiIcon', async () => {
    const component = mount(mockMainPage);
    const notiButton = component.find('.btn_notification');
    notiButton.simulate('click');
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    expect(mainPageInstance.state["openDialog"]).toEqual(true)
  });

  it('should handle onClickRecipeButton with no cuisine selected', async () => {
    const component = mount(mockMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    const itemSelectButtonFooter = component.find('.ItemSelectButtonFooter');
    await itemSelectButtonFooter.simulate('click');
    expect(spyOnSearchRecipes).toHaveBeenCalled()
  });

  it('should handle onClickRecipeButton with cuisine selected', async () => {
    const spyGetElementsByClassName = jest.spyOn(document, 'getElementsByClassName')
    .mockImplementation(() => { return [{style:{
      background: ""
    }}] });
    const mockSelectedMainPage= (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <MainPage default={{
            openDialog: false,
            mode: "normal",
            selectedCuisine: "Chinese"
            }} {...props}/>
        </ConnectedRouter>
      </Provider>
    );
    const component =  mount(mockSelectedMainPage);
    const itemSelectButtonFooter = component.find('.ItemSelectButtonFooter');
    await itemSelectButtonFooter.simulate('click');
    expect(spyGetElementsByClassName).toHaveBeenCalled()
  });


  it('should handle onClickItemSelectButton in normal mode', async () => {
    const spyGetElementsByClassName = jest.spyOn(document, 'getElementsByClassName')
    .mockImplementation(() => { return [{style:{
      background: ""
    }}] });
    const mockNormalMainPage= (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <MainPage default={{
            openDialog: false,
            mode: "normal"
            }}/>
        </ConnectedRouter>
      </Provider>
    );
    const component =  mount(mockNormalMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
  
    const itemSelectButtonHeader = component.find('.ItemSelectButtonHeader');
    itemSelectButtonHeader.simulate('click')
    expect(mainPageInstance.state["mode"]).toEqual("select")
    expect(spyGetElementsByClassName).toHaveBeenCalled();
  });

  it('should handle onClickItemSelectButton in select mode with nothing selected', async () => {
    const spyGetElementsByClassName = jest.spyOn(document, 'getElementsByClassName')
    .mockImplementation(() => { return [{style:{
      background: ""
    }}] });
    const mockNormalMainPage= (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <MainPage default={{
            openDialog: false,
            mode: "select"
            }}/>
        </ConnectedRouter>
      </Provider>
    );
    const component =  mount(mockNormalMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
  
    const itemSelectButtonHeader = component.find('.ItemSelectButtonHeader');
    itemSelectButtonHeader.simulate('click')
    expect(mainPageInstance.state["selectedCuisine"]).toEqual(
      {"Chinese": false, "Japanese": false, "Korean": false, "Western": false})
  });

  it('should handle onClickItemSelectButton in select mode with item selected', async () => {
    const spyGetElementsByClassName = jest.spyOn(document, 'getElementsByClassName')
    .mockImplementation(() => { return [{style:{
      background: "",
      height: ""
    }}] });
    const mockNormalMainPage= (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <MainPage default={{
            openDialog: false,
            mode: "select",
            selectedItemIds: [1,2]
            }}/>
        </ConnectedRouter>
      </Provider>
    );
    const component =  mount(mockNormalMainPage);
    const itemSelectButtonHeader = component.find('.ItemSelectButtonHeader');
    itemSelectButtonHeader.simulate('click')
    expect(spyGetElementsByClassName).toHaveBeenCalled();
  });

  it('should handle getAndBuildNotification', async () => {
    const component = mount(mockMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    mainPageInstance.getAndBuildNotification();
    expect(spyOnGetUserNotiList).toHaveBeenCalled();
  });

  it('should handle getCategoryList', async () => {
    const component = mount(mockMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    mainPageInstance.getCategoryList([1,2]);
  });

  it('should handle onReadNotification on recipe type noti', async () => {
    const component = mount(mockMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    let notiId = 1;
    let notiType = "recipe";
    let category = "";
    mainPageInstance.onReadNotification(notiId, notiType, category);
    expect(spyOnSearchRecipes).toHaveBeenCalled();
  });

  it('should handle onReadNotification on expire type noti', async () => {
    const component = mount(mockMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    let notiId = 1;
    let notiType = "expire";
    let category = "";
    mainPageInstance.onReadNotification(notiId, notiType, category);
    expect(spyOnSetIsRead).toHaveBeenCalled();
    // expect(spyOnSearchRecipes).toHaveBeenCalled();
  });

  it('should handle onReadNotification on buy_item type noti', async () => {
    const component = mount(mockMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    let notiId = 1;
    let notiType = "buy_item";
    let category = "";
    mainPageInstance.onReadNotification(notiId, notiType, category);
    expect(spyOnSetIsRead).toHaveBeenCalled();
  });

  it('should handle onClickSelectPreference with no cuisine selected', async () => {
    const spyGetElementsByClassName = jest.spyOn(document, 'getElementsByClassName')
    .mockImplementation(() => { return [{style:{
      backgroundColor: ""
    }}] });
    const component = mount(mockMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    mainPageInstance.onClickSelectPreference();
    expect(spyGetElementsByClassName).toHaveBeenCalled();
  });

  it('should handle onClickSelectPreference with clicking cuisine & double clicking', async () => {
    const spyGetElementsByClassName = jest.spyOn(document, 'getElementsByClassName')
    .mockImplementation(() => { return [{style:{
      backgroundColor: ""
    }}] });
    const component = mount(mockMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    const cuisineSelectButtionFooter = component.find('.Korean');
    await cuisineSelectButtionFooter.simulate('click');
    expect(spyGetElementsByClassName).toHaveBeenCalled();
    expect(mainPageInstance.state["selectedCuisine"]).toEqual(
      {"Chinese": false, "Japanese": false, "Korean": true, "Western": false});
    await cuisineSelectButtionFooter.simulate('click');
    expect(mainPageInstance.state["selectedCuisine"]).toEqual(
      {"Chinese": false, "Japanese": false, "Korean": false, "Western": false}); 
  });

  it('should handle onClickSelectPreference with clicking japanese', async () => {
    const spyGetElementsByClassName = jest.spyOn(document, 'getElementsByClassName')
    .mockImplementation(() => { return [{style:{
      backgroundColor: ""
    }}] });
    const component = mount(mockMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    const cuisineSelectButtionFooter = component.find('.Japanese');
    await cuisineSelectButtionFooter.simulate('click');
    expect(spyGetElementsByClassName).toHaveBeenCalled();
    expect(mainPageInstance.state["selectedCuisine"]).toEqual(
      {"Chinese": false, "Japanese": true, "Korean": false, "Western": false});
  });

  it('should handle onClickSelectPreference with clicking Chinese', async () => {
    const spyGetElementsByClassName = jest.spyOn(document, 'getElementsByClassName')
    .mockImplementation(() => { return [{style:{
      backgroundColor: ""
    }}] });
    const component = mount(mockMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    const cuisineSelectButtionFooter = component.find('.Chinese');
    await cuisineSelectButtionFooter.simulate('click');
    expect(spyGetElementsByClassName).toHaveBeenCalled();
    expect(mainPageInstance.state["selectedCuisine"]).toEqual(
      {"Chinese": true, "Japanese": false, "Korean": false, "Western": false});
  });

  it('should handle onClickSelectPreference with clicking Western', async () => {
    const spyGetElementsByClassName = jest.spyOn(document, 'getElementsByClassName')
    .mockImplementation(() => { return [{style:{
      backgroundColor: ""
    }}] });
    const component = mount(mockMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    const cuisineSelectButtionFooter = component.find('.Western');
    await cuisineSelectButtionFooter.simulate('click');
    expect(spyGetElementsByClassName).toHaveBeenCalled();
    expect(mainPageInstance.state["selectedCuisine"]).toEqual(
      {"Chinese": false, "Japanese": false, "Korean": false, "Western": true});
  });

  it('should handle onClickSelectItem', async () => {
    const spyGetElementsByClassName = jest.spyOn(document, 'getElementsByClassName')
      .mockImplementation(() => { return [{style:{
        background: ""
      }}] });
    const component = mount(mockMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    mainPageInstance.setState({mode: "select"})
    mainPageInstance.onClickSelectItem(2);
    console.log(mainPageInstance.state["selectedItemIds"][0])
    expect(mainPageInstance.state["selectedItemIds"][0]).toBe(2); 
  });

  it('should handle buildNotificationInfo', async () => {
    const component = mount(mockMainPage);
    const mainPageInstance = component.find(MainPage.WrappedComponent).instance();
    mainPageInstance.buildNotificationInfo();
    expect(mainPageInstance.state["isUnreadNotiExists"]).toEqual(false); 
  });
});


// const mockSelectedMainPage= (
//   <Provider store={mockStore}>
//     <ConnectedRouter history={history}>
//       <MainPage default={{
//         openDialog: false,
//         mode: "normal",
//         selectedCuisine: "Chinese"
//         }} {...props}/>
//     </ConnectedRouter>
//   </Provider>
// );