import * as actionTypes from '../actions/actionTypes';

const initialState = {
  notifications: [
    // {'id': 1, 'item_id': 1, 'expiration_date': '20201231', 'count': 2},
    // {'id': 2, 'item_id': 1, 'expiration_date': '20201231', 'count': 1},
    // {'id': 3, 'item_id': 2, 'expiration_date': '20201231', 'count': 3},
    // {'id': 4, 'item_id': 3, 'expiration_date': '20201231', 'count': 1},
    // {'id': 5, 'item_id': 4, 'expiration_date': '20201231', 'count': 1},
    // {'id': 6, 'item_id': 5, 'expiration_date': '20201231', 'count': 1},
    // {'id': 7, 'item_id': 6, 'expiration_date': '20201231', 'count': 1},
  ],
}

const notiReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_NOTI:
      return {...state, notifications: action.notifications};
    case actionTypes.SET_ISREAD:
      return {...state, notifications: state.notifications.map(noti => {
          if (noti.id === action.id) return {...noti, is_read: true};
          else return noti;
        })}
    default:
      break;
  }
  return state;
}

export default notiReducer;