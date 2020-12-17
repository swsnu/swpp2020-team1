import React, { Component } from 'react';
import { connect } from 'react-redux';
import ItemContainer from '../ItemContainer/ItemContainer';
import * as actionCreators from '../../store/actions/index';
import * as userActionCreators from '../../store/actions/user';
import { Button, Card, Fade, CircularProgress, Dialog } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack'
import axios from 'axios';
import NotiCard from '../../components/Notification/NotiCard';
import './MainPage.css';
import Logout from '../Header/LogOut';
import KoreanFlag from '../../icons/korean.png'
import JapaneseFlag from '../../icons/japanese.png'
import ChineseFlag from '../../icons/chinese.png'
import ItalianFlag from '../../icons/italian.png'
import FoodifyLogo from '../../icons/Foodify.png'
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import {withRouter} from 'react-router';

import IconButton from '@material-ui/core/IconButton';
import HelpSharpIcon from '@material-ui/icons/HelpSharp';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#7DBF1A',
      dark: '#7DBF1A',
      light: '#7DBF1A',
      contrastText: "#fff"
    },
    secondary:{
      main: '#818181',
    }
  },
});

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  nav: {
    // width: '200%',
    minWidth: '40%',
    // height: 55,
    // alignItems: 'center',
    // textAlign: 'center',
  },
  fab: {
    // margin: theme.spacing(2),
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
  },
})

class MainPage extends Component {

  state = {
    isUnreadNotiExists: false,
    openDialog: false,
    currentHeight: 1280,
    currentWidth: 720,
    notifications: [],
    selectedItemIds: [],
    selectedCuisine: {
      Korean: false,
      Japanese: false,
      Chinese: false,
      Western: false,
    },
    // selectedCuisineList: [],
    mode: "normal",
    clicked: false,
    isLoading: true,
    tutorial: false,
    help: false,
    //recipe: false
  }

  // temporary
  user_id = 1;

  async componentDidMount() {
    this.props.resetItemList();
    if (this.props.location.state && this.props.location.state.fromSignUp) {
      this.setState({tutorial: true})
    }
    this.setState({isLoading: true})
    await axios.get('/back/user/')
      .then(res => this.user_id = res.data.user_id)
      .catch(e => console.log(e)) 
    await this.props.onGetUserItems(this.user_id);
    
    for (const item of this.props.items) {
      await this.props.onGetItemCounts(item.id)
    }

    this.getAndBuildNotification(this.user_id)
    this.setState({isLoading: false})
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  componentDidUpdate = () => {
    if(this.state.mode === "preference")
      document.getElementsByClassName("ItemSelectDiv")[0].style.height = JSON.stringify(105 + this.state.currentWidth * 0.05 + Math.min(this.state.currentWidth / 5, 100))+"px";
  }

  onClickTutorialOff = () => {
    this.setState({
      tutorial: false, 
      help: false
    });
  }

  resize = () => {
    let currentHeight = window.innerHeight;
    let currentWidth = window.innerWidth;
    this.setState({currentHeight, currentWidth});
  }

  onClickAddItemButton = () => {
    this.props.history.push('/item/add', {container: 'fridge'});
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
        let item = this.props.items.find(item => item.id === itemId)
        let itemName = item.name
        let category = item.category_id

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
          category: category,
          elapsedDays: elapsedDays,
        })
      }
    }
    
    notiList.sort((a, b) => new Date(a.elapsedDays) - new Date(b.elapsedDays))
    let itemcountsWithCategory = []
    if (this.props.items.length > 0) {
      itemcountsWithCategory = this.props.itemcounts.filter((ic) => {
        let item = this.props.items.find((item) => ic.item_id === item.id)
        return item && item.category_id && item.category_id !== 200
      })
    }

    if (itemcountsWithCategory.length !== 0) {
      let array = new Uint8Array(1)
      let itemId = itemcountsWithCategory[window.crypto.getRandomValues(array)[0] % itemcountsWithCategory.length].item_id
      let item = this.props.items.find(item => item.id === itemId)
      let itemName = item.name
      let category = item.category_id
      notiList.unshift({
        id: 0,
        notiType: 'recipe',
        isRead: true,
        expirationDate: '',
        itemName: itemName,
        category: category,
        elapsedDays: 0,
      })
    }

    this.setState({ notifications: notiList })
    this.setState({ isUnreadNotiExists: this.isUnreadNotiExists() })
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

  onReadNotification = async (notiId, notiType, category) => {
    if (notiType === 'recipe') {
      this.props.onSearchRecipes([category], ['korean', 'japanese', 'chinese', 'western']);
      this.props.history.push('/recipes')
    } else if (notiType === 'expire') {
      await this.props.onSetIsRead(notiId);
      this.props.onSearchRecipes([category], ['korean', 'japanese', 'chinese', 'western']);
      this.props.history.push('/recipes')
    } else if (notiType === 'buy_item') {
      await this.props.onSetIsRead(notiId);
    }
    this.buildNotificationInfo();
    this.setState({
      openDialog: false,
    })
  }

  switchToNormalMode = () => {
    //this.setState({
    //  recipe: false
    //})
    for (let cuisine of Object.keys(this.state.selectedCuisine)) {
      document.getElementsByClassName(cuisine)[0].style.filter = "brightness(100%)";
    }
    this.setState({
      mode: "normal",
      selectedCuisine: {Korean: false, Japanese: false, Chinese: false, Western: false},
      selectedItemIds: []
    });
    document.getElementsByClassName("ItemSelectButton")[0].style.background = "#7DBF1A";
    document.getElementsByClassName("ItemSelectDiv")[0].style.height = "55px";
    let removeItemButtons = document.getElementsByClassName("btn_remove_item");
    for(let i = 0; i < removeItemButtons.length; i++) {
      removeItemButtons[i].style.visibility = "visible";
    }
  }
 
  onClickItemSelectButton = (e) => {
    if(this.state.mode === "normal") {
      this.setState({ mode: "select" });
      let removeItemButtons = document.getElementsByClassName("btn_remove_item");
      for(let i = 0; i < removeItemButtons.length; i++) {
        removeItemButtons[i].style.visibility = "hidden";
      }
    } else if(this.state.mode === "select") {
      if(this.state.selectedItemIds.length < 1) {
        this.switchToNormalMode();
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
    let selectedCuisineList = []
    for (let cuisine of Object.keys(this.state.selectedCuisine)) {
      if (this.state.selectedCuisine[cuisine]) {
        selectedCuisineList.push(cuisine.toLowerCase())
      }
      document.getElementsByClassName(cuisine)[0].style.background = "#F4F4F4";
    }
    if (selectedCuisineList.length === 0) { // if nothing is selected
      for (let cuisine of Object.keys(this.state.selectedCuisine)) {
        selectedCuisineList.push(cuisine.toLowerCase())
      }
    }
    let categoryList = this.getCategoryList(this.state.selectedItemIds);
    this.props.onSearchRecipes(categoryList, selectedCuisineList);
    this.switchToNormalMode();
    this.props.history.push('/recipes')
  }

  onClickSelectItem = (id) => {
    if (this.state.mode !== 'select') return;
    let tempSelectedItemIds = this.state.selectedItemIds;
    if(tempSelectedItemIds.filter(i => i === id).length > 0) {
      tempSelectedItemIds = tempSelectedItemIds.filter(i => i !== id);
    } else {
      if(tempSelectedItemIds.length >= 5) {
        tempSelectedItemIds.shift();
      }
      tempSelectedItemIds.push(id);
    }

    if(tempSelectedItemIds.length > 0) {
      document.getElementsByClassName("ItemSelectButton")[0].style.background = "#7DBF1A";
    } else {
      document.getElementsByClassName("ItemSelectButton")[0].style.background = "#C4C4C4";
    }
    this.setState({ selectedItemIds: tempSelectedItemIds});
  }

  onClickSelectPreference = (cuisine) => {
    if (this.state.selectedCuisine[cuisine]) { // cuisine already chosen 
      this.setState({selectedCuisine: {...this.state.selectedCuisine, [cuisine]: false}});
      document.getElementsByClassName(cuisine)[0].style.filter = "brightness(100%)";
    } else {
      this.setState({selectedCuisine: {...this.state.selectedCuisine, [cuisine]: true}});
      document.getElementsByClassName(cuisine)[0].style.filter = "brightness(50%)";
    }
  }

  onClickHelpButton = () => {
    this.setState({help: true})
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

    const { classes } = this.props;

    const notiIcon = this.state.isUnreadNotiExists ? <NotificationsActiveIcon color="primary"/> : <NotificationsActiveIcon /> ;

    return (
      <MuiThemeProvider theme={theme}>
        <div className="MainPage">
          <Container component="main" maxWidth="md" className="main_container">
            <div className="title">
              <div className="btn_logout">
                <Logout/>
              </div>
              <img alt="" className="titlelogoMain" src={FoodifyLogo}></img>
              <IconButton onClick={this.onClickHelpButton}><HelpSharpIcon fontSize="large"/></IconButton>
            </div>
            <div className="content">
              <ItemContainer 
                type="freezer"
                selectedItemIds={this.state.selectedItemIds}
                onClickSelectItem={(id) => this.onClickSelectItem(id)}
                currentWidth={this.state.currentWidth}
                currentHeight={this.state.currentHeight}
                shouldShowTutorial={!this.props.items || this.props.items.length === 0}
                items={freezerItems}
                buildNotification={() => {this.getAndBuildNotification(this.user_id)}}
                mode={this.state.mode}
                id="freezer-container"/>
              <ItemContainer
                type="fridge"
                selectedItemIds={this.state.selectedItemIds}
                onClickSelectItem={(id) => this.onClickSelectItem(id)}
                currentWidth={this.state.currentWidth}
                currentHeight={this.state.currentHeight}
                shouldShowTutorial={!this.props.items || this.props.items.length === 0}
                items={fridgeItems}
                buildNotification={() => {this.getAndBuildNotification(this.user_id)}}
                mode={this.state.mode}/>
              <ItemContainer
                type="shelf"
                selectedItemIds={this.state.selectedItemIds}
                onClickSelectItem={(id) => this.onClickSelectItem(id)}
                currentWidth={this.state.currentWidth}
                currentHeight={this.state.currentHeight}
                shouldShowTutorial={!this.props.items || this.props.items.length === 0}
                items={shelfItems}
                buildNotification={() => {this.getAndBuildNotification(this.user_id)}}
                mode={this.state.mode}/>
              <div id="dummy"></div>
            </div>
            <div className="ItemSelectDiv" >
                {this.state.mode !== 'normal' ? 
                  <div className="ItemSelectButton">
                    <div className="ItemSelectButtonHeader" onClick={(event)=>this.onClickItemSelectButton(event)}>
                      <div className="ButtonPhrase">{this.state.mode === "select" ?
                            (this.state.selectedItemIds.length === 0 ? "재료를 선택해주세요" : "레시피 추천받기") :
                            (this.state.mode === "preference" ? "오늘은 무슨 음식을 먹을까?" : "재료 선택하기")}</div>
                      {this.state.mode === "preference" ?
                        <div className="QuitButton" onClick={this.switchToNormalMode}>X</div> : null}
                      </div>
                    <div className="ItemSelectButtonMain">
                      <img alt="" className="btn_preference Korean"
                        src={KoreanFlag}
                        onClick={() => this.onClickSelectPreference("Korean")}>
                      </img>
                      <img alt="" className="btn_preference Japanese"
                        src={JapaneseFlag}
                        onClick={() => this.onClickSelectPreference("Japanese")}>
                      </img>
                      <img alt="" className="btn_preference Chinese"
                        src={ChineseFlag}
                        onClick={() => this.onClickSelectPreference("Chinese")}>
                      </img>
                      <img alt="" className="btn_preference Western"
                        src={ItalianFlag}
                        onClick={() => this.onClickSelectPreference("Western")}>
                      </img>
                    </div>
                    <div className="ItemSelectButtonFooter"
                      onClick={this.onClickRecipeButton}>검색</div>
                  </div>
                :
                  <BottomNavigation
                  showLabels
                  className={classes.root} >
                  <BottomNavigationAction label="레시피 추천" icon={<ThumbUpIcon />} onClick={this.onClickItemSelectButton} className={classes.nav}/>
                  <Tooltip title="Add" aria-label="add" onClick={this.onClickAddItemButton}>
                    <Fab color="primary" className={classes.fab}>
                      <AddIcon />
                    </Fab>
                  </Tooltip>
                  <BottomNavigationAction label="마감 임박" icon={notiIcon} onClick={this.onClickNotiIcon} className={classes.nav}/>
                  </BottomNavigation>
                   }
            </div>


            <Fade className="NotiFade" in={this.state.openDialog} >
              <div className="NotiListWrapper">
                <div>
                  <div style={{backgroundColor: '#F4F4F4', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Button style={{paddingBottom: 5}} onClick={() => { this.setState({ openDialog: false }) }}>
                      <ArrowBack/>
                    </Button>
                    <div className="NotiHeader">Notifications</div>
                  </div>
                </div>
                <div className="NotiList">
                  { this.state.notifications.length > 0 ?
                  <Card>
                    { this.state.notifications.map(noti => (
                      <NotiCard width='100%' key={noti.id} noti={noti} onRead={this.onReadNotification}/>
                    ))}
                  </Card> : <div className='NotificationEmpty'>아직 알림이 없습니다.</div>}

                </div>
              </div>
            </Fade>
            <Dialog open={this.state.tutorial || this.state.help} fullWidth maxWidth='md' onBackdropClick={()=>this.setState({tutorial: false, help: false})}>
              <div className="tutorialHeader">
                Foodify Tutorial
                <Button style={{position: 'absolute', right: 0}} onClick={this.onClickTutorialOff}>X</Button>
              </div>
              <div className="iosWarning">
                아이폰의 경우 사파리 브라우저에서 접속해주세요!
              </div>
              <div className="videoContainer">
                <iframe 
                  title="video"
                  className={`video`}
                  src={"https://www.youtube.com/embed/yP69wYmFtm8"}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
            </Dialog>
          </Container>
          { this.state.isLoading ? 
            <div className="LoadingDialog">
              <CircularProgress className='Circular'></CircularProgress>
            </div> : null }
        </div>
        </MuiThemeProvider>
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
    loginCheck : (user) => dispatch (userActionCreators.loginCheckRequest()),
    resetItemList: () => dispatch(actionCreators.resetItemList())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(MainPage)));