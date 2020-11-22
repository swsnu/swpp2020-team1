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
    notifications: [],
  }
  async componentDidMount() { 
    // temporary user
    const user_id = 1;

    // temporary login
    await axios.post('/back/signin/', {'username': 'jaeseoklee', 'password': 'roborobo'})
      .then(res => console.log(res))
      .catch(e => console.log(e))

    await this.props.onGetUserItems(user_id);
    for (const item of this.props.items) {
      await this.props.onGetItemCounts(item.id)
    }
    console.log("itemcounts: " + JSON.stringify(this.props.itemcounts))
    console.log("items: " + JSON.stringify(this.props.items))
    console.log("notifications: " + JSON.stringify(this.props.notifications))

    await this.props.onGetUserNotiList(user_id)
    this.buildNotificationInfo();

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

  isUnreadNotiExists = () => {
    if (this.state.notifications.filter(noti => !noti.isRead).length > 0) {
      console.log(JSON.stringify("Unread: " + this.state.notifications))
      return true;
    }
    else return false;
  }
  
  buildNotificationInfo = () => {
    let notiList = []
    for (let noti of this.props.notifications) {
      if (noti.noti_type === 'expire') {
        let { id, noti_type, is_read, expire_date, item_count_id } = noti;
        let itemId = this.props.itemcounts.find(ic => ic.id === item_count_id).item_id
        let itemName = this.props.items.find(item => item.id === itemId).name
        notiList.push({
          id: id,
          notiType: noti_type,
          isRead: is_read,
          expirationDate: expire_date,
          itemName: itemName,
        })
      }
    }
    
    notiList.sort((a, b) => new Date(b.expirationDate) -  new Date(a.expirationDate))

    this.setState({ notifications: notiList })
    this.setState({ isUnreadNotiExists: this.isUnreadNotiExists() })
    console.log("notifications: " + JSON.stringify(this.state.notifications))
  }

  onClickNotiIcon = () => {
    this.setState({openDialog: true})
  }

  onReadNotification = async (notiId) => {
    await this.props.onSetIsRead(notiId);
    console.log("onSetIsRead! + notifications: " + JSON.stringify(this.props.notifications))
    this.buildNotificationInfo();
    this.setState({
      openDialog: false,
    })
  }

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
          <div className="title">
            <div className="titleOrange">Food</div>
            <div className="titleBlack">ify</div>
            <div className="btn_notification" onClick={this.onClickNotiIcon}>
              <DeleteIcon className="btn_bell" fontSize="large" />
              { this.state.isUnreadNotiExists ? <Circle style={styles.overlay} color="secondary"/> : null }
            </div>
          </div>
          {/*<Typography>{this.state.currentWidth} and {this.state.currentHeight}</Typography>*/}
          <ItemContainer type="freezer" currentWidth={this.state.currentWidth} currentHeight={this.state.currentHeight} items={freezerItems}/>
          <ItemContainer type="fridge" currentWidth={this.state.currentWidth} currentHeight={this.state.currentHeight} items={fridgeItems}/>
          <ItemContainer type="shelf" currentWidth={this.state.currentWidth} currentHeight={this.state.currentHeight} items={shelfItems}/>
          {/* <Basket/> */}
          <div className="ItemSelectDiv">
            <div className="ItemSelectButton">SELECT Ingredients</div>
          </div>

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
                {this.state.notifications.map(noti => (
                  <NotiCard key={noti.id} noti={noti} onRead={this.onReadNotification}/>
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
    notifications: state.notification.notifications,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onGetUserItems: (user_id) => dispatch(actionCreators.getUserItems(user_id)),
    onGetItemCounts: (item_id) => dispatch(actionCreators.getItemCounts(item_id)),
    onGetUserNotiList: (user_id) => dispatch(actionCreators.getUserNotiList(user_id)),
    onSetIsRead: (noti_id) => dispatch(actionCreators.setIsRead(noti_id)),
  }
}

const styles = {
  overlay: {
     position: 'absolute',
     top: '12px',
     right: '0px',
     height: '12px',
     color: 'red',
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);