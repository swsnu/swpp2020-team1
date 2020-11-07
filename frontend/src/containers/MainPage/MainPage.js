import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ItemContainer from '../ItemContainer/ItemContainer';
import Basket from '../../components/Basket/Basket';
import * as actionCreators from '../../store/actions/index';


class MainPage extends Component {
  state = {
    freezerItems: null,
    fridgeItems: null,
    shelfItems: null
  }
  
  componentDidMount() { 
    this.props.onGetItems();
    this.props.onGetItemCounts();

    let items = this.props.items.map(i => {
      const ic = this.props.itemcounts.filter(ic => ic.item_id === i.id);
      return {...i, 'itemcounts': ic};
    });

    this.setState({freezerItems: items.filter(i => i.container === 'freezer')});
    this.setState({fridgeItems: items.filter(i => i.container === 'fridge')});
    this.setState({shelfItems: items.filter(i => i.container === 'shelf')});


    // filter, join table (in django?)
  //   this.setState({freezerItems: this.props.itemcounts
  //     .filter(ic => ic.container === 'freezer')
  //     .map(ic => {
  //       let item = this.props.items.find(i => i.id === ic.item_id);
  //       return {...ic, 'name': item.name, 'category_id': item.category_id};
  //     })
  //   });
  
  //   this.setState({fridgeItems: this.props.itemcounts
  //     .filter(ic => ic.container === 'fridge')
  //     .map(ic => {
  //       let item = this.props.items.find(i => i.id === ic.item_id);
  //       return {...ic, 'name': item.name, 'category_id': item.category_id};
  //     })
  //   });

  //   this.setState({shelfItems: this.props.itemcounts
  //     .filter(ic => ic.container === 'shelf')
  //     .map(ic => {
  //       let item = this.props.items.find(i => i.id === ic.item_id);
  //       return {...ic, 'name': item.name, 'category_id': item.category_id};
  //     })
  //   });
  
  }

  onClickNotificationButton = () => {

  }

  onClickCommunityButton = () => {

  }

  render() {

    return (
      <div className="MainPage">
        <div className="title">{this.props.title}</div>
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
    onGetItems: () => dispatch(actionCreators.getItems()),
    onGetItemCounts: () => dispatch(actionCreators.getItemCounts()),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainPage));