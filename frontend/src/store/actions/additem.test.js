import * as actionCreators from './index';
import * as actionTypes from './actionTypes';

describe('store/actions/additem', () => {
  let dispatchMock;
  beforeEach(() => {
    dispatchMock = jest.fn(value => value);
  });

  afterEach(() => { 
    jest.clearAllMocks() 
  });

  it('should handle updateItemList', () => {
    const stubUpdateItem = {
      id: 1,
      item: {cateogry: "freezer"}
    }

    actionCreators.updateItemList(stubUpdateItem.id, stubUpdateItem.item)(dispatchMock);
    expect(dispatchMock.mock.calls[0][0].type).toBe(actionTypes.UPDATE_ITEM_LIST)
    expect(dispatchMock.mock.calls[0][0].id).toBe(stubUpdateItem.id);
    expect(dispatchMock.mock.calls[0][0].item).toBe(stubUpdateItem.item);
  });

  it('should handle addNewItem', () => {
    const stubUpdateItem = {
      item: {cateogry: "freezer"}
    }

    actionCreators.addNewItem(stubUpdateItem.item)(dispatchMock);
    expect(dispatchMock.mock.calls[0][0].type).toBe(actionTypes.ADD_NEW_ITEM);
    expect(dispatchMock.mock.calls[0][0].item).toBe(stubUpdateItem.item);
  });

  it('should handle resetItemList', () => {
    actionCreators.resetItemList()(dispatchMock);
    expect(dispatchMock.mock.calls[0][0].type).toBe(actionTypes.RESET_ITEM_LIST)
  });
})