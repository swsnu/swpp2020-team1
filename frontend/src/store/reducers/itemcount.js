import * as actionTypes from '../actions/actionTypes';

const initialState = {
  itemcounts: [
    // {'id': 1, 'item_id': 1, 'expiration_date': '20201231', 'count': 2},
    // {'id': 2, 'item_id': 1, 'expiration_date': '20201231', 'count': 1},
    // {'id': 3, 'item_id': 2, 'expiration_date': '20201231', 'count': 3},
    // {'id': 4, 'item_id': 3, 'expiration_date': '20201231', 'count': 1},
    // {'id': 5, 'item_id': 4, 'expiration_date': '20201231', 'count': 1},
    // {'id': 6, 'item_id': 5, 'expiration_date': '20201231', 'count': 1},
    // {'id': 7, 'item_id': 6, 'expiration_date': '20201231', 'count': 1},
  ],
}

const itemcountReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ITEMCOUNTS:
      return {...state, itemcounts: state.itemcounts.filter(ic => ic.item_id != action.item_id)
                                                    .concat(action.itemcounts)};
    case actionTypes.EDIT_ITEMCOUNT:
      return {...state, itemcounts: action.itemcounts.map(ic => {
        if (ic.id === action.itemcount.id) return action.itemcount;
        else return ic;
      })}
    default:
      break;
  }
  return state;
}

export default itemcountReducer;