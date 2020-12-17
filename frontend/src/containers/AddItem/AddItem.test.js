import React from 'react';
import axios from 'axios';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';

import AddItem from './AddItem';
import { getMockStore } from '../../mock';
import EditItem from '../../components/AddItem/EditItem';
import Result from '../../components/AddItem/Result';

import * as itemActionCreators from '../../store/actions/item';
import * as additemActionCreators from '../../store/actions/additem';
import Scanner from '../../components/AddItem/Scanner';

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

jest.mock('../../components/AddItem/Scanner', () => jest.fn())


const stubExpDate = new Date('2020/12/31')

const stubInitialState = {
  item: {
    items: [],
  },
  itemcount: {
    itemcounts: [],
  },
  article: {
    articles: [],
    selectedArticle: []
  },
  notification: {
    notifications: []
  },
  recipe: {
    recipes: []
  },
  additem: {
    resultList: [{
        'name': 'item1', 
        'barcode_num': '100', 
        'expiration_date': stubExpDate, 
        'category_id': 1,
        'category_name': 'c1', 
        'container': 'freezer', 
        'count': 1
      },
      {
        'name': 'item2', 
        'barcode_num': '200', 
        'expiration_date': stubExpDate, 
        'category_id': 1,
        'category_name': 'c2', 
        'container': 'fridge', 
        'count': 2
      }]
  }
};



const mockStore = getMockStore(stubInitialState);

describe('<AddItem />', () => {

  afterEach(() => {jest.clearAllMocks()})

  let addItem, mockHistory, spyOnAddItem, spyOnResetItemList;

  beforeEach(() => {
    
      Scanner.mockImplementation(props => {
        return (
          <div className="Scanner">
              Scanner
          </div>
        );
      })
      

    mockHistory = {push: jest.fn()}

    addItem = (
      <Provider store={mockStore}>
        <BrowserRouter>
        <Switch>
          <Route path='/' exact render={() => <AddItem history={mockHistory} location={{state: null}}/>} />
        </Switch>
        </BrowserRouter>
      </Provider>
    );
  })

  it('should render addItem', async () => {
    const component = mount(addItem);
    const wrapper = component.find('.AddItem');
    expect(wrapper.length).toBe(1);
  });




});