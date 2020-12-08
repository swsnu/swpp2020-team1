import './App.css';
import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import * as userActionCreators from './store/actions/user';
import {connect} from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import axios from 'axios';

import SignIn from './containers/Landing/SignIn/SignIn';
import SignUp from './containers/Landing/SignUp/SignUp';
import MainPage from './containers/MainPage/MainPage';
import AddItem from './containers/AddItem/AddItem';
import ItemConfirm from './containers/ItemConfirm/ItemConfirm';
import RecipeRecommend from './containers/RecipeRecommend/RecipeRecommend';
import RecipeDetail from './containers/RecipeDetail/RecipeDetail';
import LoginRoute from './LoginRoute';

class App extends Component {
  componentDidMount(){
    axios.get('/back/token/');
    this.props.loginCheck();
  }
  render(){
    return (
      <ConnectedRouter history={this.props.history}>
        <Switch>
          <div className="App">
            <Route path = '/signin' exact component={SignIn}/>
            <Route path = '/signup' exact component={SignUp}/>
            <LoginRoute path='/' exact component={MainPage}/>
            <LoginRoute path = '/item/add' exact component = {AddItem}/>
            <LoginRoute path = '/item/confirm' exact component={ItemConfirm}/>
            <LoginRoute path = '/recipes' exact component={RecipeRecommend}/>
            <LoginRoute path = '/recipes/:id' exact component={RecipeDetail}/>
          </div>
        </Switch>
      </ConnectedRouter>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loginCheck : (user) => dispatch (userActionCreators.loginCheckRequest())
  }
}

const mapStateToProps = state => {
  return {
    currentUser : state.user.status.isLoggedIn
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);