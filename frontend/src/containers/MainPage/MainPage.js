import React, { Component } from 'react';
import { connect } from 'react-redux';
import ItemContainer from '../ItemContainer/ItemContainer';
import Basket from '../../components/Basket/Basket';
import * as actionCreators from '../../store/actions/index';


class MainPage extends Component {
  state = {
    freezerItems: null,
    fridgeItems: null,
    shelfItems: null
  }
  
  async componentDidMount() { 
    const user_id = 1;

    await this.props.onGetUserItems(user_id);
    for (const item of this.props.items) {
      await this.props.onGetItemCounts(item.id)
    }

    let items = this.props.items.reduce((result, i) => {
      const ic = this.props.itemcounts.filter(ic => ic.item_id === i.id);
      if (ic.length > 0) result.push({...i, 'itemcounts': ic});
      return result; 
    }, []);

    this.setState({freezerItems: items.filter(i => i.container === 'freezer')});
    this.setState({fridgeItems: items.filter(i => i.container === 'fridge')});
    this.setState({shelfItems: items.filter(i => i.container === 'shelf')});
  
  }

  onClickNotificationButton = () => {

  }

  onClickCommunityButton = () => {

  }

  render() {

    return (
      <div className="MainPage">
        <ItemContainer type="freezer" items={this.state.freezerItems}/>
        <ItemContainer type="fridge" items={this.state.fridgeItems}/>
        <ItemContainer type="shelf" items={this.state.shelfItems}/>
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