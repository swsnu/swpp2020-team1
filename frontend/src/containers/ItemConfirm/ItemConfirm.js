import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, Container, Button, TextField, Select, InputLabel, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Card, Grid } from "@material-ui/core";
import * as actionCreators from '../../store/actions/index';
import EditItem from '../../components/AddItem/EditItem';
import Result from '../../components/AddItem/Result';
import './ItemConfirm.css';
import moment from 'moment'

class ItemConfirm extends Component {
  containers = ['freezer', 'fridge', 'shelf'];
  state = {
    items: [],

    item_add: {
      name: '', 
      barcode_num: '', 
      expiration_date: '', 
      category_id: 0, 
      category_name: '',
      container: this.containers[0],
      count: 0
    },
    addResultOpen: false,

    item_edit: {},
    editDialogOpen: false,
    editingItemIdx: 0,
  }

  componentDidMount() {
    // this.props.onGetCategories();
    this.setState({items: this.props.location.state ? this.props.location.state.items : []});
  }

  onClickEditItemButton = (item, idx) => {
    this.setState({
      editingItemIdx: idx,
      item_edit: item,
      editDialogOpen: true
    });
  }

  onCancelEditButton = () => {
    this.setState({editDialogOpen: false});
  }

  onConfirmEditButton = (info) => {
    if (!info.valid) {
      return;
    }
    this.setState({
      items: this.state.items.map((item, idx) => {
        if (idx === this.state.editingItemIdx) {
          return {
            'name': info.name, 
            'barcode_num': info.barcode_num, 
            'expiration_date': info.expiration_date ?
                moment(info.expiration_date).format("YYYY/MM/DD") : '-',
            'category_id': info.category_id, 
            'category_name': info.category_name,
            'container': info.container, 
            'count': parseInt(info.count)
          };
        } else {
          return item;
        }
      }),
      editDialogOpen: false});
  }
  
  onClickAddItemButton = () => {
    this.setState({addResultOpen: true})
  }

  onCancelAddButton = () => {
    this.setState({addResultOpen: false})
  }

  onConfirmAddButton = (info) => {
    if (!info.valid) {
      return;
    }
    this.setState({
      items: this.state.items.concat({
        'name': info.name, 
        'barcode_num': info.barcode_num, 
        'expiration_date': info.expiration_date ?
            moment(info.expiration_date).format("YYYY/MM/DD") : "-",
        'category_id': info.category_id, 
        'category_name': info.category_name,
        'container': info.container, 
        'count': parseInt(info.count)
      }),
      addResultOpen: false
    })
  }

  onClickConfirmButton = () => {
    for (let item of this.state.items) {
      if (item.category_id === 0) {
        item.category_name = "기타";
        item.category_id = 200; // category_id of '기타'
      }
      if (item.expiration_date === '-') {
        item.expiration_date = '2099/12/31';
      }
      this.props.onAddItem(item);
    }
    this.props.history.push('/');
  }

  render() {
    const newItems = this.state.items.map((item, idx) => {
      // temporary category name
      return (
        <EditItem key={idx} itemInfo={item} />
      );
    });

    if(document.getElementsByClassName("Result").length > 0) {
      if(!this.state.addResultOpen) {
        document.getElementsByClassName("Result")[0].style.top = "-300px";
      } else {
        document.getElementsByClassName("Result")[0].style.top = "-25px";
      }
    }

    return (
      <div className="ItemConfirm">
        <Result result={{ name: '', category_id: '', category_name: '', barcode_num: '', expiration_date: '', count: 1 }}></Result>
        <div className="Header">
          <p>Add Ingredients</p>  
        </div>
        
        <div className="Main">
          {newItems}  
        </div>
        
        <div className="Footer">
          <div id="AddManuallyButton" className="ManualAddButton" onClick={this.onClickAddItemButton} >+</div>
          <div id='onClickMoveToConfirmButton' className="ConfirmButton" onClick={this.onClickConfirmButton} >Confirm</div>
        </div>
      </div>
     );
  }
}

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddItem: (item) => dispatch(actionCreators.addItem(item)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemConfirm);