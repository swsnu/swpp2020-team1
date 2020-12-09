import store from '../store';
import { history } from '../store';
import axios from 'axios';
import * as userActionCreators from '../actions/user';

const stubLogout = {
  status: 'INIT'
}

const stubInitState = {
  valid: false,
  isLoggedIn: false,
  currentUser: ''
}

const stubSignSuccess = {
  status: 'SUCCESS',
  error: -1
}

const stubSignFailure = {
  status: 'FAILURE',
  error: 1
}

const stubLoginSucess = {
  status: 'SUCCESS'
}

const stubLoggedInStatus = {
  valid: false,
  isLoggedIn: true,
  currentUser: 'TEST-USER'
}

const stubLoginFailure = {
  status: 'FAILURE'
}

const stubWaiting = {
  status: 'WAITING'
}

describe('LoginRoute', () => {
  afterEach(() => { 
    jest.clearAllMocks() 
  });

  it(`should call register(), axios.post, signUpSuccess(), push() on 'signUpRequest' success`, (done) => {
    const stubUser = {
      email: "TEST-USER",
      password: "TEST-PASSWORD",
      nickname : "TEST-NICKNAME"
    };
    const spyHistoryPush = jest.spyOn(history, 'push')
      .mockImplementation(path => {});

    const spyAxiosPost = jest.spyOn(axios, 'post')
      .mockImplementation((url, user) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 201,
            data : stubUser
          };
          resolve(result);
        });
      })
    
    store.dispatch(userActionCreators.signUpRequest()).then(() => {
      const newState = store.getState();
      expect(newState.user.register).toEqual(stubSignSuccess);
      expect(spyAxiosPost).toHaveBeenCalledTimes(1);
      expect(spyHistoryPush).toBeCalledTimes(1)
      done();
    });
  });

  it(`should call signUpFailure(), alert() on 'signUpRequest' error`, (done) => {
    const stubUser = {
      email: "TEST-USER",
      password: "TEST-PASSWORD",
      nickname : "TEST-NICKNAME"
    };
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => { return () => {}; });
    const spyAxiosPost = jest.spyOn(axios, 'post')
      .mockImplementation((url, user) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 400
          };
          reject(result);
        });
      })
    
    store.dispatch(userActionCreators.signUpRequest()).then(() => {
      const newState = store.getState();
      expect(newState.user.register).toEqual(stubSignFailure);
      expect(spyAxiosPost).toHaveBeenCalledTimes(1);
      expect(spyAlert).toBeCalledTimes(1)
      done();
    });
  })

  it(`should call login(), axios.post(), loginSuccess(), push()  on 'loginRequest' success`, (done) => {
    const stubUser = {
      username: "TEST-USER",
      password: "TEST-PASSWORD"
    };
    const spyHistoryPush = jest.spyOn(history, 'push')
      .mockImplementation(path => {});

    const spyAxiosPost = jest.spyOn(axios, 'post')
      .mockImplementation((url, user) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 201,
            data : stubUser
          };
          resolve(result);
        });
      })
    
    store.dispatch(userActionCreators.loginRequest(stubUser)).then(() => {
      const newState = store.getState();
      expect(newState.user.login).toEqual(stubLoginSucess);
      expect(newState.user.status).toEqual(stubLoggedInStatus);
      expect(spyAxiosPost).toHaveBeenCalledTimes(1);
      expect(spyHistoryPush).toBeCalledTimes(1)
      done();
    });
  });

  it(`should call loginFailure(), alert() on 'loginRequest' error`, (done) => {
    const stubUser = {
      email: "TEST-USER",
      password: "TEST-PASSWORD",
    };
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => { return () => {}; });
    const spyAxiosPost = jest.spyOn(axios, 'post')
      .mockImplementation((url, user) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 400,
            data : 'login fail'
          };
          reject(result);
        });
      })
    
    store.dispatch(userActionCreators.loginRequest()).then(() => {
      const newState = store.getState();
      expect(newState.user.login).toEqual(stubLoginFailure);
      expect(spyAxiosPost).toHaveBeenCalledTimes(1);
      expect(spyAlert).toBeCalledTimes(1)
      done();
    });
  })

  it(`should call login(), axios.get(), loginSuccess() 'loginCheckRequest' success`, (done)=>{
    const spyAxiosGet = jest.spyOn(axios, 'get')
    .mockImplementation((url, user) => {
      return new Promise((resolve, reject) => {
        const result = {
          status: 200,
          data : {
            username: 'TEST-USER'
          }
        };
        resolve(result);
      });
    })
    store.dispatch(userActionCreators.loginCheckRequest()).then(() => {
      const newState = store.getState();
      expect(newState.user.login).toEqual(stubLoginSucess);
      expect(newState.user.status).toEqual(stubLoggedInStatus);
      expect(spyAxiosGet).toHaveBeenCalledTimes(1);
      done();
    }); 
  })

  it(`should call login(), axios.get(), push() 'loginCheckRequest' error`, (done)=>{
    const spyHistoryPush = jest.spyOn(history, 'push')
      .mockImplementation(path => {})
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
    store.dispatch(userActionCreators.loginCheckRequest()).then(() => {
      const newState = store.getState();
      expect(newState.user.login).toEqual(stubWaiting);
      expect(spyAxiosGet).toHaveBeenCalledTimes(1);
      expect(spyHistoryPush).toHaveBeenCalledTimes(1);
      done();
    }); 
  })

  it(`should call axios.get(), dispatch LOGOUT on 'logoutRequest' success`, (done) => {
    const spyAxiosGet = jest.spyOn(axios, 'get')
      .mockImplementation((url, user) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 201
          };
          resolve(result);
        });
      })
    
    store.dispatch(userActionCreators.logoutRequest()).then(() => {
      const newState = store.getState();
      expect(newState.user.login).toEqual(stubLogout);
      expect(newState.user.status).toEqual(stubInitState);
      expect(spyAxiosGet).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`should call axios.get(), alert() on 'logoutRequest' error`, (done) => {
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => { return () => {}; });
    const spyAxiosGet = jest.spyOn(axios, 'get')
      .mockImplementation((url, user) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 400
          };
          reject(result);
        });
      })
    store.dispatch(userActionCreators.logoutRequest()).then(() => {
      const newState = store.getState();
      expect(spyAxiosGet).toHaveBeenCalledTimes(1);
      expect(spyAlert).toHaveBeenCalledTimes(1);
      done();
    });

  });
})