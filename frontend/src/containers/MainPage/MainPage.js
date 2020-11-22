import React, { Component } from 'react';
import { connect } from 'react-redux';
import ItemContainer from '../ItemContainer/ItemContainer';
import Basket from '../../components/Basket/Basket';
import * as actionCreators from '../../store/actions/index';
import { IconButton, Dialog, List, Typography, Button } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/Inbox'
import DeleteIcon from '@material-ui/icons/Notifications';
import ArrowBack from '@material-ui/icons/ArrowBack'
import Circle from '@material-ui/icons/Brightness1'
import axios from 'axios';
import NotiCard from '../../components/Notification/NotiCard';
import './MainPage.css';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

class MainPage extends Component {

  notiSample = [
    {id: 1, notiType: 'expire', expirationDate: '2020/11/20', itemName: '서울우유', isRead: false},
    {id: 2, notiType: 'expire', expirationDate: '2020/11/23', itemName: '홈런볼', isRead: false},
    {id: 3, notiType: 'expire', expirationDate: '2020/11/23', itemName: '홈런볼', isRead: true},
  ]

  state = {
    isUnreadNotiExists: false,
    openDialog: false,
    currentHeight: 1280,
    currentWidth: 720,
  }
  async componentDidMount() { 
    // temporary user
    const user_id = 1;

    // temporary login
    await axios.post('/back/signin/', {'username': 'jaeseoklee', 'password': '0000'})
      .then(res => console.log(res))
      .catch(e => console.log(e))

    await this.props.onGetUserItems(user_id);
    for (const item of this.props.items) {
      this.props.onGetItemCounts(item.id)
    }
    this.setState({ isUnreadNotiExists: this.isUnreadNotiExists() })

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize = () => {
    let currentHeight = window.innerHeight;
    let currentWidth = window.innerWidth;
    this.setState({currentHeight, currentWidth});
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }

  onClickNotiIcon = () => {
    this.setState({openDialog: true})
  }

  onClickNotification = () => {
    this.setState({openDialog: false})
  }

  isUnreadNotiExists = () => {
    // jaeseok
    return false;
  }
  // onClickCommunityButton = () => {

  // }

  render() {
    let items = this.props.items.reduce((result, i) => {
      const ic = this.props.itemcounts.filter(ic => ic.item_id === i.id);
      if (ic.length > 0) result.push({...i, 'itemcounts': ic});
      return result; 
    }, []);

    /*let items_tmp = [{
      name: 'Seoul Milk 1.5L',
      container: 'freezer',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'freezer',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'freezer',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'freezer',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'freezer',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'freezer',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'freezer',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'freezer',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'freezer',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'freezer',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'fridge',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'fridge',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'fridge',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'fridge',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'fridge',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'fridge',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'fridge',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'fridge',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'fridge',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'fridge',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'shelf',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'shelf',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'shelf',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'shelf',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'shelf',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'shelf',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }, {
      name: 'Seoul Milk 1.5L',
      container: 'shelf',
      itemcounts: [{
        id: 1,
        expiration_date: '2020/11/21',
        count: 30
      }]
    }]*/

    const freezerItems =  items.filter(i => i.container === 'freezer') //should change items to items_tmp
    const fridgeItems =  items.filter(i => i.container === 'fridge')
    const shelfItems =  items.filter(i => i.container === 'shelf')

    
    return (
        <div className="MainPage">
          <div className="title">Foodify</div>
          {/*<Typography>{this.state.currentWidth} and {this.state.currentHeight}</Typography>*/}
          <ItemContainer type="freezer" currentWidth={this.state.currentWidth} currentHeight={this.state.currentHeight} items={freezerItems}/>
          <ItemContainer type="fridge" currentWidth={this.state.currentWidth} currentHeight={this.state.currentHeight} items={fridgeItems}/>
          <ItemContainer type="shelf" currentWidth={this.state.currentWidth} currentHeight={this.state.currentHeight} items={shelfItems}/>
          {/* <Basket/> */}
          <button className="btn_notification" onClick={()=>this.onClickNotiIcon()}>"Notification"</button>
          <button className="btn_community">"Community"</button>
          <IconButton onClick={this.onClickNotiIcon}>
            <DeleteIcon/>
            { this.state.isUnreadNotiExists ? <Circle style={styles.overlay} color="secondary"/> : null }
          </IconButton>
      
          <Dialog open={this.state.openDialog} fullScreen={true}>
            <div>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Button style={{padding: 0}} onClick={() => { this.setState({ openDialog: false }) }}>
                  <ArrowBack/>
                </Button>
                <Typography style={{fontSize: 24, color: '#818181', fontWeight: 900}}>Notifications</Typography>
              </div>
            </div>
            <div>
              <List>
                {this.notiSample.map(noti => (
                  <NotiCard key={noti.id} noti={noti} onClick={this.onClickNotification}/>
                ))}
              </List>
            </div>
          </Dialog>
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    items: state.item.items,
    itemcounts: state.itemcount.itemcounts,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onGetUserItems: (user_id) => dispatch(actionCreators.getUserItems(user_id)),
    onGetItemCounts: (item_id) => dispatch(actionCreators.getItemCounts(item_id)),
  }
}

const styles = {
  overlay: {
     position: 'absolute',
     top: '12px',
     left: '17px',
     height: '10px',
     color: 'red',
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);