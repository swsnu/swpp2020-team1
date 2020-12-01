import React, { Component } from 'react';
import { connect } from 'react-redux';
import ItemContainer from '../ItemContainer/ItemContainer';
import Basket from '../../components/Basket/Basket';
import * as actionCreators from '../../store/actions/index';
import * as userActionCreators from '../../store/actions/userAction';
import { IconButton, Dialog, List, Typography, Button } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/Inbox'
import NotiIcon from '@material-ui/icons/Notifications';
import ArrowBack from '@material-ui/icons/ArrowBack'
import Circle from '@material-ui/icons/Brightness1'
import axios from 'axios';
import NotiCard from '../../components/Notification/NotiCard';
import './MainPage.css';
import { Redirect } from 'react-router';

class MainPage extends Component {

  state = {
    isUnreadNotiExists: false,
    openDialog: false,
    currentHeight: 1280,
    currentWidth: 720,
    notifications: [],
    selectedItemIds: [],
    selectedCuisine: null,
    mode: "normal"
  }

  // temporary
  user_id = 1;

  async componentDidMount() { 
    if(this.props.currentUser !== 'SUCCESS') {
      this.props.loginCheck()
      // return  <Redirect to = "/signin" />
    }

    await axios.get('/back/user/')
      .then(res => 
        // this.user_id = res.data.user_id
        this.user_id = 1
       )
      .catch(e => console.log(e)) 
      
    // temporary login
    // await axios.post('/back/signin/', {'username': 'jaeseoklee', 'password': '0000'})
    //   .then(res => console.log(res))
    //   .catch(e => console.log(e))

    await this.props.onGetUserItems(this.user_id);
    for (const item of this.props.items) {
      await this.props.onGetItemCounts(item.id)
    }
    // console.log("itemcounts: " + JSON.stringify(this.props.itemcounts))
    // console.log("items: " + JSON.stringify(this.props.items))
    // console.log("notifications: " + JSON.stringify(this.props.notifications))

    this.getAndBuildNotification(this.user_id)

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  componentDidUpdate = () => {
    if(this.state.mode === "preference")
      document.getElementsByClassName("ItemSelectDiv")[0].style.height = JSON.stringify(105 + this.state.currentWidth * 0.05 + Math.min(this.state.currentWidth / 5, 100))+"px";
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
      return true;
    }
    else return false;
  }
  
  buildNotificationInfo = () => {
    let notiList = []
    for (let noti of this.props.notifications) {
      if (noti.noti_type === 'expire' || noti.noti_type === 'buy_item') {
        let { id, noti_type, is_read, expire_date, item_count_id } = noti;
        let itemId = this.props.itemcounts.find(ic => ic.id === item_count_id).item_id
        let itemName = this.props.items.find(item => item.id === itemId).name

        const expirationDateType = new Date(expire_date)
        let creationTimestamp = noti.noti_type === 'expire' ? 
          expirationDateType.getTime() - 3 * 24 * 60 * 60 * 1000 : expirationDateType.getTime()
          // set expirationDay - 3d as creation time if 'expire', set itself as creation time if 'buy_item'
        const currentTimestamp = new Date()
        const elapsedDays = Math.floor((currentTimestamp - creationTimestamp) / (24 * 60 * 60 * 1000))
        notiList.push({
          id: id,
          notiType: noti_type,
          isRead: is_read,
          expirationDate: expire_date,
          itemName: itemName,
          elapsedDays: elapsedDays,
        })
      }
    }
    
    notiList.sort((a, b) => new Date(a.elapsedDays) - new Date(b.elapsedDays))

    if (this.props.itemcounts.length !== 0) {
      const itemId = this.props.itemcounts[[Math.floor(Math.random() * this.props.itemcounts.length)]].item_id
      const itemName = this.props.items.find(item => item.id === itemId).name
      notiList.unshift({
        id: 0,
        notiType: 'recipe',
        isRead: true,
        expirationDate: '',
        itemName: itemName,
        elapsedDays: 0,
      })
    }

    this.setState({ notifications: notiList })
    this.setState({ isUnreadNotiExists: this.isUnreadNotiExists() })
    console.log("notifications: " + JSON.stringify(this.state.notifications))
  }

  getAndBuildNotification = (user_id) => {
    this.props.onGetUserNotiList(user_id) 
    .then(() => {
      this.buildNotificationInfo()
    })
  }

  onClickNotiIcon = () => {
    this.setState({openDialog: true})
  }

  onReadNotification = async (notiId) => {
    if (notiId !== 0) { // notiId === 0 means 'recipe' noti type
      await this.props.onSetIsRead(notiId);
      console.log("onSetIsRead! + notifications: " + JSON.stringify(this.props.notifications))
    }
    this.buildNotificationInfo();
    this.setState({
      openDialog: false,
    })
  }

  onClickItemSelectButton = () => {
    if(this.state.mode === "normal") {
      this.setState({ mode: "select" });
      document.getElementsByClassName("ItemSelectButton")[0].style.background = "#C4C4C4";
      let removeItemButtons = document.getElementsByClassName("btn_remove_item");
      for(let i = 0; i < removeItemButtons.length; i++) {
        removeItemButtons[i].style.visibility = "hidden";
      }
    } else if(this.state.mode === "select") {
      if(this.state.selectedItemIds.length < 1) {
        alert("please select one or more ingredients!");
      } else {
        this.setState({ mode: "preference" })
        document.getElementsByClassName("ItemSelectDiv")[0].style.height =
          JSON.stringify(100 + this.state.currentWidth * 0.05 + Math.min(this.state.currentWidth / 5, 100))+"px";
      }
    }
  }

  getCategoryList = (itemIds) => {
    let categories = []
    for (let id of itemIds) {
      let item = this.props.items.find(elem => elem.id === id)
      categories.push(item.category_id)
    } 
    return Array.from(new Set(categories)); // make unique
  }

  onClickRecipeButton = () => {
    if (this.state.selectedCuisine) {
      document.getElementsByClassName(this.state.selectedCuisine)[0].style.background = "#F4F4F4";
    }
    let categoryList = this.getCategoryList(this.state.selectedItemIds);
    this.props.onSearchRecipes(categoryList, this.state.selectedCuisine.toLowerCase());
    this.setState({ mode: "normal", selectedCuisine: null, selectedItemIds: [] });
    document.getElementsByClassName("ItemSelectButton")[0].style.background = "#E8A065";
    document.getElementsByClassName("ItemSelectDiv")[0].style.height = "55px";
    let removeItemButtons = document.getElementsByClassName("btn_remove_item");
    for(let i = 0; i < removeItemButtons.length; i++) {
      removeItemButtons[i].style.visibility = "visible";
    }
    this.props.history.push('/recipes')
  }

  onClickSelectItem = (id) => {
    let tempSelectedItemIds = this.state.selectedItemIds;
    if(tempSelectedItemIds.filter(i => i === id).length > 0) {
      tempSelectedItemIds = tempSelectedItemIds.filter(i => i !== id);
    } else {
      if(tempSelectedItemIds.length >= 3) {
        tempSelectedItemIds.shift();
      }
      tempSelectedItemIds.push(id);
    }

    if(tempSelectedItemIds.length > 0) {
      document.getElementsByClassName("ItemSelectButton")[0].style.background = "#E8A065";
    }
    this.setState({ selectedItemIds: tempSelectedItemIds});
  }

  onClickSelectPreference = (cuisine) => {
    if(this.state.selectedCuisine != null) {
      document.getElementsByClassName(this.state.selectedCuisine)[0].style.backgroundColor = "#F4F4F4";
    }
    if(this.state.selectedCuisine !== cuisine) {
      this.setState({selectedCuisine: cuisine});
      document.getElementsByClassName(cuisine)[0].style.backgroundColor = "#989898";
    } else {
      this.setState({selectedCuisine: null});
    }
  }

  render() {
    let items = this.props.items.reduce((result, i) => {
      const ic = this.props.itemcounts.filter(ic => ic.item_id === i.id);
      if (ic.length > 0) result.push({...i, 'itemcounts': ic});
      return result;
    }, []);

    const freezerItems = items.filter(i => i.container === 'freezer') //should change items to items_tmp
    const fridgeItems = items.filter(i => i.container === 'fridge')
    const shelfItems = items.filter(i => i.container === 'shelf')

    
    return (
        <div className="MainPage">
          <div className="title">
            <div className="titleOrange">Food</div>
            <div className="titleBlack">ify</div>
            <div className="btn_notification" onClick={this.onClickNotiIcon}>
              <NotiIcon className="btn_bell" fontSize="large" />
              { this.state.isUnreadNotiExists ? <Circle style={styles.overlay} color="secondary"/> : null }
            </div>
          </div>
          {/*<Typography>{this.state.currentWidth} and {this.state.currentHeight}</Typography>*/}
          <ItemContainer 
            type="freezer"
            selectedItemIds={this.state.selectedItemIds}
            onClickSelectItem={(id) => this.onClickSelectItem(id)}
            currentWidth={this.state.currentWidth}
            currentHeight={this.state.currentHeight}
            items={freezerItems}
            buildNotification={() => {this.getAndBuildNotification(this.user_id)}}
            mode={this.state.mode}/>
          <ItemContainer
            type="fridge"
            selectedItemIds={this.state.selectedItemIds}
            onClickSelectItem={(id) => this.onClickSelectItem(id)}
            currentWidth={this.state.currentWidth}
            currentHeight={this.state.currentHeight}
            items={fridgeItems}
            buildNotification={() => {this.getAndBuildNotification(this.user_id)}}
            mode={this.state.mode}/>
          <ItemContainer
            type="shelf"
            selectedItemIds={this.state.selectedItemIds}
            onClickSelectItem={(id) => this.onClickSelectItem(id)}
            currentWidth={this.state.currentWidth}
            currentHeight={this.state.currentHeight}
            items={shelfItems}
            buildNotification={() => {this.getAndBuildNotification(this.user_id)}}
            mode={this.state.mode}/>
          {/* <Basket/> */}
          <div className="ItemSelectDiv" onClick={this.onClickItemSelectButton}>
            <div className="ItemSelectButton">
              <div className="ItemSelectButtonHeader">
                {this.state.mode !== "normal" ?
                  this.state.selectedItemIds.length + " Ingredients Selected" :
                  "SELECT Ingredients"}
              </div>
              <div className="ItemSelectButtonMain">
                <div className="btn_preference Korean" 
                  onClick={() => this.onClickSelectPreference("Korean")}>Korean</div>
                <div className="btn_preference Japanese"
                  onClick={() => this.onClickSelectPreference("Japanese")}>Japanese</div>
                <div className="btn_preference Chinese"
                  onClick={() => this.onClickSelectPreference("Chinese")}>Chinese</div>
                <div className="btn_preference Italian"
                  onClick={() => this.onClickSelectPreference("Italian")}>Italian</div>
              </div>
              <div className="ItemSelectButtonFooter"
                onClick={this.onClickRecipeButton}>Move</div>
            </div>
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
    currentUser : state.user.login.status
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onGetUserItems: (user_id) => dispatch(actionCreators.getUserItems(user_id)),
    onGetItemCounts: (item_id) => dispatch(actionCreators.getItemCounts(item_id)),
    onGetUserNotiList: (user_id) => dispatch(actionCreators.getUserNotiList(user_id)),
    onSetIsRead: (noti_id) => dispatch(actionCreators.setIsRead(noti_id)),
    onSearchRecipes: (ingredients, preference) => dispatch(actionCreators.searchRecipes(ingredients, preference)),
    loginCheck : (user) => dispatch (userActionCreators.loginCheckRequest())
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