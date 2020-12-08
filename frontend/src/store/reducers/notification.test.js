import notiReducer from "./notification";
import * as actionTypes from '../actions/actionTypes';

let stubNoti = [
  {"id": 1, "noti_type": "expire", "is_read": false, "expire_date": "2020-11-30", "user_id": 1, "item_count_id": 1},
  {"id": 2, "noti_type": "expire", "is_read": false, "expire_date": "2020-12-30", "user_id": 1, "item_count_id": 2},
]

const stubInitialState = {
  notifications: stubNoti,
}

describe('notification reducer', () => {
  it('should return initial state', () => {
    const initialState = notiReducer(undefined, {}); 
    expect(initialState).toEqual({
      notifications: [],
    });
  });

  it('should get all user notifications', () => {
    const updateState = notiReducer(undefined, {
      type: actionTypes.GET_USER_NOTI, 
      notifications: stubNoti
    });
    expect(updateState.notifications).toEqual(stubNoti);
  })
  
  it('should set isread', () => {
    const updateState = notiReducer(stubInitialState, {
      type: actionTypes.SET_ISREAD,
      id: 1,
    });
    expect(updateState.notifications[0].is_read).toEqual(true);
  })
});