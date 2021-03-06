import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Switch, BrowserRouter } from 'react-router-dom';

import ItemContainer from './ItemContainer';
// import Item from '../../components/Item/Item'
import { getMockStore } from '../../mock';
import * as itemcountActionCreators from '../../store/actions/itemcount';


// jest.mock('../../components/Item/Item', () => jest.fn())

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
};

const mockStore = getMockStore(stubInitialState);

describe('<ItemContainer />', () => {

  afterEach(() => {jest.clearAllMocks()})

  let itemContainer, mockHistory, mockItems;
  beforeEach(() => {
    // Item.mockImplementation(props => {
    //   return (
    //     <div className="Item">
    //         <button className="selectItem" onClick={(id) => props.onClickSelectItem(id)}></button>
    //         <button className="clickCard" onClick={(ic) => props.onClickCard(ic)}></button>
    //     </div>
    //   );
    // })

    mockHistory = {push: jest.fn()}
    mockItems = [
      {'id': 1, 
      'user_id': 1, 
      'container': 'freezer', 
      'barcode_num': 100, 
      'name': 'steak', 
      'category_id': 1,
      'itemcounts': [{'id': 1, 'item_id': 1, 'expiration_date': '20201231', 'count': 2}]
      },
      {'id': 2, 
      'user_id': 1, 
      'container': 'freezer', 
      'barcode_num': 101, 
      'name': 'egg', 
      'category_id': 2,
      'itemcounts': [{'id': 1, 'item_id': 1, 'expiration_date': '20201231', 'count': 2}]
      },
    ]

    itemContainer = (
      <Provider store={mockStore}>
        <BrowserRouter>
        <Switch>
          <ItemContainer type="freezer" items={mockItems} selectedItemIds={[1]} history={mockHistory}/>
        </Switch>
        </BrowserRouter>
      </Provider>
    );
  })

  it('should render itemContainer', () => {
    const component = mount(itemContainer);
    const wrapper = component.find('.ItemContainer');
    expect(wrapper.length).toBe(1);
  });

  it('should handle add item button', () => {
    const component = mount(itemContainer);

    const addItemButton = component.find('.AddItemButton');
    addItemButton.simulate('click');

    // why this is not working? maybe because it's not a route defined in App.js
    // expect(mockHistory.push).toHaveBeenCalled();
  });

  it('should handle itemcounts', () => {
    const component = mount(itemContainer);
    const itemContainerInstance = component.find(ItemContainer.WrappedComponent).instance();
    itemContainerInstance.setState({
      itemcounts: [{"id": 1, "expiration_date": "2020/11/30", "count": 1, "item_id": 1}],
    })
    itemContainerInstance.onAddItem({cancelBubble: false}, 1, 1)
    itemContainerInstance.setState({
      itemcounts: [{"id": 1, "expiration_date": "2020/11/30", "count": 1, "item_id": 1},
          {"id": 2, "expiration_date": "2020/11/20", "count": 1, "item_id": 1}],
      seen: true,
    })
    itemContainerInstance.onAddItem({cancelBubble: false}, 1, 1)
  });

  // it('should handle click item', () => {
  //   const component = mount(itemContainer);
  //   const itemContainerInstance = component.find(ItemContainer.WrappedComponent).instance();
  //   itemContainerInstance.setState({
  //     itemcounts: [{"id": 1, "expiration_date": "2020/11/30", "count": 1, "item_id": 1}],
  //   })
  //   const itemButton = component.find(Item).at(0);
  //   itemButton.simulate('click');
  // });

  it('should handle remove item button', () => {
    const spyEditItemCount = jest.spyOn(itemcountActionCreators, 'editItemCount')
      .mockImplementation(art => {return dispatch => Promise.resolve({})});
 

    const component = mount(itemContainer);
    const itemContainerInstance = component.find(ItemContainer.WrappedComponent).instance();
    itemContainerInstance.setState({
      itemcounts: [{"id": 1, "expiration_date": "2020/11/30", "count": 1, "item_id": 1}],
    })
    itemContainerInstance.onRemoveItem({cancelBubble: false}, 1, 1)
    itemContainerInstance.setState({
      itemcounts: [{"id": 1, "expiration_date": "2020/11/30", "count": 1, "item_id": 1}, 
            {"id": 2, "expiration_date": "2020/11/20", "count": 1, "item_id": 1}],
      seen: true,
    })
    itemContainerInstance.onRemoveItem({cancelBubble: false}, 1, 1)
    itemContainerInstance.onClickCard([{"id": 1, "expiration_date": "2020/11/30", "count": 1, "item_id": 1}, 
    {"id": 2, "expiration_date": "2020/11/20", "count": 1, "item_id": 1}], "aa")
    itemContainerInstance.onClickCardOff();
    expect(spyEditItemCount).toHaveBeenCalled();
  });

  it('should render when this.props.items is null', () => {
    itemContainer = (
      <Provider store={mockStore}>
        <BrowserRouter>
        <Switch>
          <ItemContainer type="freezer" items={[]} history={mockHistory}/>
        </Switch>
        </BrowserRouter>
      </Provider>
    );
    mount(itemContainer);
  }) 


});

