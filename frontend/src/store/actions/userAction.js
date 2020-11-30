import * as actionTypes from './actionTypes';
import { push } from 'connected-react-router';
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const signUpRequest = (newUser) => {
    return dispatch => {
        dispatch(register())
        return axios.post('/back/signup/', newUser)
        .then( response => {
            dispatch(signUpSuccess());
        })
    }
}

export function register() {
    return {
        type: actionTypes.SIGN_UP
    };
}
 
export function signUpSuccess() {
    console.log("signUpSuccess");
    return {
        type: actionTypes.SIGN_UP_SUCCESS
    };
}
 
export function signUpFailure(error) {
    return {
        type: actionTypes.SIGN_UP_FAILURE,
        error
    };
}

export const loginRequest = (user) => {
  console.log("loginRequest/user");
  console.log(user)
  return dispatch => {
      dispatch(login());
      return axios.post('/back/signin/', user)
        .then( response => {
            dispatch(loginSuccess(user.username))
        })
  }
}

export const loginCheckRequest = () => {
  return dispatch => {
      dispatch(login());
      return axios.get('/back/user/').then(
          response => {
              dispatch(loginSuccess(response.data.username))
          }
      )
      .catch(error => {
          dispatch(push('/signin'))
      })
  }
}


export const logoutRequest = () => {
  return dispatch => {
      return axios.get('/back/signout/')
      .then( response => {
          dispatch({
              type : actionTypes.LOGOUT
          })
      })
      .catch(error => {
          alert('logout fail')
      })
  }
}

export function login() {
  console.log("login()")
  return {
      type: actionTypes.LOGIN
  };
}

export function loginSuccess(username){
  return {
      type: actionTypes.LOGIN_SUCCESS,
      username : username
  };
}

export function loginFailure(error) {
  return {
      type: actionTypes.LOGIN_FAILURE,
  };
}