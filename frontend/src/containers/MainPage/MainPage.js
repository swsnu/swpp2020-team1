import React, { Component } from 'react';
import { connect } from 'react-redux';
import ItemContainer from '../ItemContainer/ItemContainer';
import Basket from '../../components/Basket/Basket';
import * as actionCreators from '../../store/actions/index';
import axios from 'axios';

class MainPage extends Component {
  
  async componentDidMount() { 
    // temporary user
    const user_id = 2;
    
    // temporary login
    await axios.post('/signin/', {'username': 'user1', 'password': 'pwpwpwpw'})
      .then(res => console.log(res));

    await this.props.onGetUserItems(user_id);
    for (const item of this.props.items) {
      this.props.onGetItemCounts(item.id)
    }
  }

  onClickNotificationButton = () => {

  }

  onClickCommunityButton = () => {

  }

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


export default connect(mapStateToProps, mapDispatchToProps)(MainPage);