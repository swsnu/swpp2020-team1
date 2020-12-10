import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, Container, Button, TextField, Select, InputLabel, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Card, Grid } from "@material-ui/core";
import * as actionCreators from '../../store/actions/index';
import ItemCard from '../../components/ItemConfirm/ItemCard';
import EditItem from '../../components/AddItem/EditItem';
import Result from '../../components/AddItem/Result';
import './ItemConfirm.css';
import moment from 'moment'

class ItemConfirm extends Component {
  containers = ['freezer', 'fridge', 'shelf'];

  defaultItem = {
    name: '',
    container: 'fridge',
    category_id: 0,
    category_name: '기타',
    barcode_num: '',
    expiration_date: Date.now(),
    count: 1
  }

  state = {
    currentItem: this.defaultItem,
    editDialogOpen: false,
    editingItemIdx: -1,
    editingItem: null
  }

  onClickEditItemButton = (id) => {
    this.setState({ 
      addResultOpen: true, 
      editingItemIdx: id, 
      editingItem: this.props.resultList[id] 
    });
  }

  onClickFinishAddItemButton = () => {
    this.props.onAddNewItem(this.state.currentItem);
    this.setState({
      currentItem: this.defaultItem
    });
  }

  onChangeAddItemValue = (value) => {
    this.setState({
      currentItem: {
        ...this.state.currentItem,
        ...value
      }
    })
  }

  onChangeEditItemValue = (value) => {
    this.setState({
      editingItem: {
        ...this.state.editingItem,
        ...value
      }
    })
  }

  onClickFinishEditItemButton = () => {
    this.props.onUpdateItemList(this.state.editingItemIdx, this.state.editingItem);
    this.setState({ 
      editingItemIdx: -1,
      editingItem: null 
    });  
  }

  onClickConfirmButton = async () => {
    for (let item of this.props.resultList) {
      let finalItem = item;
      if (finalItem.category_id === 0) {
        finalItem.category_name = "기타";
        finalItem.category_id = 200; // category_id of '기타'
      }
      if (finalItem.expiration_date === '-') {
        finalItem.expiration_date = '2099/12/31';
      } else {
        finalItem.expiration_date = moment(finalItem.expiration_date).format('YYYY/MM/DD');
      }
      await this.props.onAddItem(finalItem);
    }

    this.props.resetItemList();
    this.props.history.push('/');
  }

  onClickMoveToAddItemButton = () => {
    this.props.history.push('/item/add');
  }

  componentDidMount() {
    document.getElementsByClassName("Result")[0].style.top = "-25px";
  }

  render() {
    const newItems = this.props.resultList.map((item, idx) => {
      // temporary category name
      if(idx == this.state.editingItemIdx) {
        return <EditItem id={idx} key={idx}
                  item={this.state.editingItem} 
                  onChangeEditItem={this.onChangeEditItemValue} 
                  onClickFinishEditItem={this.onClickFinishEditItemButton} />
      } else {
        return <ItemCard key={idx} id={idx} item={item} onClickEdit={this.onClickEditItemButton} />;
      }
    }).reverse();

    return (
      <div className="ItemConfirm">
        <Result isAddItem={false} 
                item={this.state.currentItem} 
                onClickFinishEditItem={this.onClickFinishAddItemButton} 
                onChangeEditItem={this.onChangeAddItemValue} />
        <div className="HeaderName"></div>
        
        <div className="Main">
          {newItems}  
        </div>
        
        <div className="Footer">
          <div id='onClickMoveToConfirmButton' className="ConfirmButton" onClick={this.onClickConfirmButton} >완료</div>
          <div id='onClickMoveToAddItemButton' className="ConfirmButton" onClick={this.onClickMoveToAddItemButton} >카메라</div>
        </div>
      </div>
     );
  }
}

const mapStateToProps = state => {
  return {
    resultList: state.additem.resultList
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onAddItem: (item) => dispatch(actionCreators.addItem(item)),
    onUpdateItemList: (id, item) => dispatch(actionCreators.updateItemList(id, item)),
    onAddNewItem: (item) => dispatch(actionCreators.addNewItem(item)),
    resetItemList: () => dispatch(actionCreators.resetItemList())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemConfirm);