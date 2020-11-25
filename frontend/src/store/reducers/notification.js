import * as actionTypes from '../actions/actionTypes';

const initialState = {
  notifications: [
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