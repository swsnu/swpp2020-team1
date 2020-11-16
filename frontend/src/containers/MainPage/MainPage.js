import React, { Component } from 'react';
import { connect } from 'react-redux';
import ItemContainer from '../ItemContainer/ItemContainer';
import Basket from '../../components/Basket/Basket';
import * as actionCreators from '../../store/actions/index';
import { IconButton, Dialog, DialogTitle, DialogContent, List } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Notifications';
import Circle from '@material-ui/icons/Brightness1'
import axios from 'axios';
import NotiCard from '../../components/Notification/NotiCard';

class MainPage extends Component {

  notiSample = [
    {notiType: 'expiration_date', time: '2020/11/14', expirationDate: '2020/11/20', itemName: '서울우유'},
    {notiType: 'expiration_date', time: '2020/11/15', expirationDate: '2020/11/23', itemName: '홈런볼'},
  ]

  state = {
    isUnreadNotiExists: false,
    openDialog: false,
  }
  async componentDidMount() { 
    // temporary user
    const user_id = 1;

    // temporary login
    await axios.post('/signin/', {'username': 'user1', 'password': 'pwpwpwpw'})
      .then(res => console.log(res))
      .catch(e => console.log(e))

    await this.props.onGetUserItems(user_id);
    for (const item of this.props.items) {
      this.props.onGetItemCounts(item.id)
    }
    this.setState({ isUnreadNotiExists: this.isUnreadNotiExists() })
  }

  onClickNotificationButton = () => {
    this.setState({openDialog: true})
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

    const freezerItems =  items.filter(i => i.container === 'freezer')
    const fridgeItems =  items.filter(i => i.container === 'fridge')
    const shelfItems =  items.filter(i => i.container === 'shelf')


    return (
      <div className="MainPage">
        <ItemContainer type="freezer" items={freezerItems}/>
        <ItemContainer type="fridge" items={fridgeItems}/>
        <ItemContainer type="shelf" items={shelfItems}/>
        {/* <Basket/> */}
        <button className="btn_notification" onClick={()=>this.onClickNotificationButton()}>"Notification"</button>
        <button className="btn_community">"Community"</button>
        <IconButton onClick={this.onClickNotificationButton}>
          <DeleteIcon/>
          { this.state.isUnreadNotiExists ? <Circle style={styles.overlay} color="secondary"/> : null }
        </IconButton>
        <Dialog open={this.state.openDialog} onClose={() => { this.setState({openDialog: false}) }}>
          <DialogTitle>Notifications</DialogTitle>
          <DialogContent>
            <div>
              <List component="nav">
                {this.notiSample.map(noti => (
                  <NotiCard key={noti.id} noti={noti}/>
                ))}
              </List>
            </div> 
          </DialogContent>
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