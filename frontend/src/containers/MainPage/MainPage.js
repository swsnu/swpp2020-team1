import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ItemContainer from '../ItemContainer/ItemContainer';
import Basket from '../../components/Basket/Basket';

class MainPage extends Component{
  componentDidMount() { 

  }

  onClickNotificationButton = () => {

  }
  onClickCommunityButton = () => {

  }

  render() {
    return (
      <div className="MainPage">
        <div className="title">{this.props.title}</div>
        <ItemContainer type="freezer"/>
        <ItemContainer type="fridge"/>
        <ItemContainer type="shelf"/>
        {/* <Basket/> */}
        <button className="btn_notification" onClick={()=>this.onClickNotificationButton()}>"Notification"</button>
        <button className="btn_community">"Community"</button>
      </div>

    );
  }
}

const mapStateToProps = state => {
  return {

  };
}

const mapDispatchToProps = dispatch => {
  return {

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainPage));