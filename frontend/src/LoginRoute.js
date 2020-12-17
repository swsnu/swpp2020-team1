import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import React from 'react';

import * as userActionCreators from './store/actions/user';

const LoginRoute = ({component: Component, currentUser, username, loginCheck, ...rest  }) => (
  <Route {...rest} render = {props => 
    {
      if(currentUser !== 'SUCCESS') {
        loginCheck()
      } 
      else{
        return <Component {...props} />
      }
    } 
    }/>
  )
  const mapStateToProps = state => {
    return {
      currentUser : state.user.login.status,
      username : state.user.status.currentUser
    }
  };

  const mapDispatchToProps = dispatch => {
    return {
      loginCheck : (user) => dispatch (userActionCreators.loginCheckRequest())
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(LoginRoute);