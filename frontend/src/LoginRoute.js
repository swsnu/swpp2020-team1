import {  Route } from 'react-router-dom'
import {connect} from 'react-redux'
import React from 'react';
import * as userActionCreators from './store/actions/userAction';

const LoginRoute = ({component : Component, currentUser, username, loginCheck, ...rest  }) => (
    <Route {...rest} render = {props => 
      {
        if(currentUser !== 'SUCCESS') {
          loginCheck()
          console.log("IS NOT LOGGED IN");
        } 
        else{
          console.log(`LOGGED IN AS [USERNAME]${username}`);
          return <Component {...props} />
        }
      } 
     }/>
  )
  const mapStateToProps = state => {
    return {
      currentUser : state.user.login.status,
      username : state.user.status.currentUser

    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      loginCheck : (user) => dispatch (userActionCreators.loginCheckRequest())
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(LoginRoute);