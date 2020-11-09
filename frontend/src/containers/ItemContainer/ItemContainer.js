import React, {Component} from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Item from '../../components/Item/Item';
import AddItem from '../../components/AddItem/AddItem';
import * as actionCreators from '../../store/actions/index';


class ItemContainer extends Component{
  onClickAddItemButton = () => {
    this.props.history.push('/item/add');
  }

  onRemoveItem = (id, count) => {
    this.props.onEditItemCount(id, count);
  }

  render() {
    let items = null;
    if (this.props.items) {
      items = this.props.items.map(i => {
        return (
          <Item
            name={i.name}
            container={i.container}
            itemcounts={i.itemcounts}
            unit="temp-unit"
            onRemoveItem={(ic_id, count) => this.onRemoveItem(ic_id, count)}
          />
        );
      })
    }

    return (
      <div className="ItemContainer">
        <p className="ContainerName">Container Name: {this.props.type}</p>
        <div className="Items">{items}</div>
        <button className="btn_add_item" onClick={()=>this.onClickAddItemButton()}>Add Item</button>
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
    onEditItemCount: () => dispatch(actionCreators.editItemCount()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemContainer);