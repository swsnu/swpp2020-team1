import React, {Component} from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Item from '../../components/Item/Item';
import AddItem from '../../components/AddItem/AddItem';

class ItemContainer extends Component{
  onClickAddItemButton = () => {

  }
  render() {
    const item = (
      <Item 
      barcode_name="temp-barcode"
      item_name="temp-item"
      expiration_date="temp-expiration"
      container="temp-container"
      unit="temp-unit"
      count={1}
      /> 
    );
    return(
      <div className="ItemContainer">
        <p className="ContainerName">Container Name: {this.props.type}</p>
        <div className="Items">{item}</div>
        <button className="btn_add_item" onClick={()=>this.onClickAddItemButton()}>Add Item</button>
      </div>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemContainer);