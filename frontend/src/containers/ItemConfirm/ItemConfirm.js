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
  state = {
    items: [],

    item_edit: {},
    editDialogOpen: false,
    editingItemIdx: -1
  }

  onClickEditItemButton = (id) => {
    this.setState({ addResultOpen: true, editingItemIdx: id });
  }

  onFinishAddItemButton = () => {
    console.log(this.state.editingItemIdx);
    this.props.onAddNewItem();
    
  }

  onFinishEditItemButton = () => {
    this.setState({ editingItemIdx: -1 });  
  }

  onConfirmAddButton = (info) => {
    if (!info.valid) {
      return;
    }
    this.setState({
      items: this.state.items.concat({
        'name': info.name, 
        'barcode_num': info.barcode_num, 
        'expiration_date': info.expiration_date,
        'category_id': info.category_id, 
        'category_name': info.category_name,
        'container': info.container, 
        'count': parseInt(info.count)
      }),
    })
  }

  onClickConfirmButton = () => {
    let resultListLength = this.props.resultList.length;
    let tmpCount = 1;
    for (let item of this.props.resultList) {
      if(tmpCount == resultListLength) {
        break;
      } else {
        tmpCount = tmpCount + 1;
      }
  
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
      this.props.onAddItem(finalItem);
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
      if(idx < this.props.resultList.length - 1) {
        if(idx == this.state.editingItemIdx) {
          return <EditItem id={idx} onClickEditItem={this.onFinishEditItemButton} />
        } else {
          return <ItemCard key={idx} id={idx} item={item} onClickEdit={this.onClickEditItemButton} />;
        }
      } else {
        return null;
      }
    }).reverse();

    return (
      <div className="ItemConfirm">
        <Result isAddItem={false} onClickEditItem={this.onFinishAddItemButton}></Result>
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
    onAddNewItem: () => dispatch(actionCreators.addNewItem()),
    resetItemList: () => dispatch(actionCreators.resetItemList())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemConfirm);