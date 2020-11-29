import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, Container, Button, TextField, Select, InputLabel, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Card, Grid } from "@material-ui/core";
import * as actionCreators from '../../store/actions/index';
import EditItem from '../../components/AddItem/EditItem';
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
    addDialogOpen: false,

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
            'expiration_date': moment(info.expiration_date).format("YYYY/MM/DD"),
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
    this.setState({addDialogOpen: true})
  }

  onCancelAddButton = () => {
    this.setState({addDialogOpen: false})
  }

  onConfirmAddButton = (info) => {
    if (!info.valid) {
      return;
    }
    this.setState({
      items: this.state.items.concat({
        'name': info.name, 
        'barcode_num': info.barcode_num, 
        'expiration_date': moment(info.expiration_date).format("YYYY/MM/DD"),
        'category_id': info.category_id, 
        'category_name': info.category_name,
        'container': info.container, 
        'count': parseInt(info.count)
      }),
      addDialogOpen: false
    })
  }

  onClickConfirmButton = () => {
    for (let item of this.state.items) {
      if (item.category_id === 0) {
        item.category_name = "기타";
        item.category_id = 200; // category_id of '기타'
      }
      this.props.onAddItem(item);
    }
    this.props.history.push('/');
  }

  onClickWebcamModeButton = () => {
    this.props.history.push('/item/add', this.state.items);
  }

  render() {
    const newItems = this.state.items.map((item, idx) => {
      // temporary category name
      return (
        <Card key={idx} className="new_item">
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Typography color="textSecondary">Name</Typography>
              <Typography>{item.name}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography color="textSecondary">Barcode number</Typography>
              <Typography>{item.barcode_num}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography color="textSecondary">Expiration date</Typography>
              <Typography>{item.expiration_date}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography color="textSecondary">Count</Typography>
              <Typography>{item.count}</Typography>
              </Grid>
            <Grid item xs={2}>
              <Typography color="textSecondary">Category</Typography>
              <Typography>{item.category_name}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography color="textSecondary">Container</Typography>
              <Typography>{item.container}</Typography>
            </Grid>            
          </Grid>
          <Button className="btn_item_edit" onClick={() => this.onClickEditItemButton(item, idx)}>edit</Button>
        </Card>
      );
    });

    return (
      <div className="ItemConfirm">
        <Dialog open={this.state.editDialogOpen} onClose={() => this.setState({editDialogOpen: false})}>
          <EditItem itemInfo={this.state.item_edit} onCancelEdit={this.onCancelEditButton} onConfirmEdit={this.onConfirmEditButton}></EditItem>
        </Dialog>
        <Dialog open={this.state.addDialogOpen} onClose={() => this.setState({addDialogOpen: false})}>
          <EditItem itemInfo={this.state.item_add} onCancelEdit={this.onCancelAddButton} onConfirmEdit={this.onConfirmAddButton}></EditItem>
        </Dialog>

        <Typography variant="h5">New Items</Typography>
        {newItems}

        <Button className="btn_add_item" onClick={this.onClickAddItemButton}>Add New Item</Button>

        <Button className="btn_confirm" onClick={this.onClickConfirmButton}>Confirm</Button>
        <Button className="btn_webcam_mode" onClick={this.onClickWebcamModeButton}>Go to automatic mode</Button>
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