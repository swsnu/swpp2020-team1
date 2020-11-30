import './App.css';
import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import * as userActionCreators from './store/actions/userAction';
import {connect} from 'react-redux';

import SignIn from './containers/Landing/SignIn/SignIn';
import SignUp from './containers/Landing/SignUp/SignUp';
import MainPage from './containers/MainPage/MainPage';
import AddItem from './containers/AddItem/AddItem';
import ItemConfirm from './containers/ItemConfirm/ItemConfirm';
import RecipeRecommend from './containers/RecipeRecommend/RecipeRecommend';

class App extends Component {
  componentDidMount(){
    axios.get('/back/token/');
    this.props.loginCheck();
  }
  render(){
    return (
    <BrowserRouter>
      <div className="App">
        <Switch>
        {/* <Route path='/' exact component={SignIn}/> */}
          <Route path = '/signin' exact component={SignIn}/>
          <Route path = '/signup' exact component={SignUp}/>
          <Route path = '/' exact component={MainPage}/>
          <Route path = '/item/add' exact component = {AddItem}/>
          <Route path = '/item/confirm' exact component={ItemConfirm}/>
          <Route path = '/recipes' exact component={RecipeRecommend}/>
          {/* <Route render={() => <h1>Not Found</h1>} /> */}
        </Switch>
      </div>
    </BrowserRouter>
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