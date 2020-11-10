import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, Container, Button, TextField, Select, InputLabel, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import * as actionCreators from '../../store/actions/index';
import './ItemConfirm.css';

class ItemConfirm extends Component {
  containers = ['freezer', 'fridge', 'shelf'];
  state = {
    name_create: '',
    barcode_create: '',
    expiration_date_create: '',
    category_id_create: 0,
    container_create: this.containers[0],
    count_create: 0,
    // for testing. In the future, this wll be given as props
    items: [
      {'name': 'item1', 'barcode_num': '100', 'expiration_date': '2020/11/11', 'category_id': 1, 'container': 'freezer', 'count': 1},
      {'name': 'item2', 'barcode_num': '101', 'expiration_date': '2020/11/11', 'category_id': 1, 'container': 'freezer', 'count': 2},
      {'name': 'item3', 'barcode_num': '102', 'expiration_date': '2020/11/11', 'category_id': 2, 'container': 'freezer', 'count': 3},
    ],
    editDialogOpen: false,
    editingItemIdx: 0,
    name_edit: '',
    barcode_edit: '',
    expiration_date_edit: '',
    category_id_edit: 1,
    container_edit: this.containers[0],
    count_edit: 0,
  }

  componentDidMount() {
    // this.props.onGetCategories();
    // this.setState({items: this.props.location.state.items});
  }

  validateInputs() {
    return true;
  }

  onClickEditItemButton = (item, idx) => {
    this.setState({
      editingItemIdx: idx,
      name_edit: item.name,
      barcode_edit: item.barcode_num,
      expiration_date_edit: item.expiration_date,
      category_id_edit: item.category_id,
      container_edit: item.container,
      count_edit: item.count,
      editDialogOpen: true
    });
  }

  onCancelEdit = () => {
    this.setState({editDialogOpen: false});
  }

  onConfirmEdit = () => {
    if (!this.validateInputs()) {
      // set error message below input field
      return;
    }
    this.setState({
      items: this.state.items.map((item, idx) => {
        if (idx === this.state.editingItemIdx) {
          return {
            'name': this.state.name_edit, 
            'barcode_num': this.state.barcode_edit, 
            'expiration_date': this.state.expiration_date_edit, 
            'category_id': this.state.category_id_edit,
            'container': this.state.container_edit, 
            'count': parseInt(this.state.count_edit)
          };
        } else {
          return item;
        }
      }),
      editDialogOpen: false});
  }
  
  onClickAddItemButton = () => {
    if (!this.validateInputs()) {
      // set error message below input field 

      return;
    }
    this.setState({
      items: this.state.items.concat({
        'name': this.state.name_create, 
        'barcode_num': this.state.barcode_create, 
        'expiration_date': this.state.expiration_date_create,
        'category_id': this.state.category_id_create, 
        'container': this.state.container_create, 
        'count': parseInt(this.state.count_create)}),
      name_create: '',
      barcode_create: '',
      expiration_date_create: '',
      category_id_create: 0,
      container_create: this.containers[0],
      count_create: 0,
    });
  }

  onClickConfirmButton = () => {
    for (let item of this.state.items) {
      console.log(item)
      this.props.onAddItem(item);
    }
    this.props.history.push('/');
  }

  onClickWebcamModeButton = () => {
    this.props.history.push('/item/add', this.state.items);
  }

  render() {
    const newItems = this.state.items.map((item, idx) => {
      return (
        <Container key={idx}>
          <Typography>{item.name} - {item.barcode_num} - {item.expiration_date} - {item.container} - {item.count}</Typography>
          <Button className="btn_item_edit" onClick={() => this.onClickEditItemButton(item, idx)}>edit</Button>
        </Container>
      );
    });

    return (
      <div className="ItemConfirm">
        <Dialog open={this.state.editDialogOpen} onClose={() => this.setState({editDialogOpen: false})}>
          <DialogTitle id="edit_dialog_title">Edit your item</DialogTitle>
          <DialogContent>
          <form>
            <TextField 
              value={this.state.name_edit}
              onChange={e => this.setState({name_edit: e.target.value})}
              className="item_name_edit margin" 
              label="Name"
              margin="dense" />
            <TextField 
              value={this.state.barcode_edit}
              onChange={e => this.setState({barcode_edit: e.target.value})}              
              className="item_barcode_edit margin" 
              label="Barcode number"
              margin="dense" />
            <TextField 
              value={this.state.expiration_date_edit}
              onChange={e => this.setState({expiration_date_edit: e.target.value})}               
              className="item_expiration_date_edit margin" 
              label="Expiration date"
              margin="dense" />
            <TextField 
              value={this.state.count_edit}
              onChange={e => this.setState({count_edit: e.target.value})}               
              className="item_count_edit margin" 
              label="Count"
              margin="dense" />
            <InputLabel id="select_container_label">Container</InputLabel>
            <Select 
              labelId="select_container_label"
              value={this.state.container_edit} 
              onChange={e => this.setState({container_edit: e.target.value})} 
              className="item_container_edit margin" 
              label="Container">
              {this.containers.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onCancelEdit}>Cancel</Button>
            <Button onClick={this.onConfirmEdit}>Ok</Button>
          </DialogActions>
        </Dialog>

        <Typography variant="h5">New Items</Typography>
        {newItems}
        <Container>
          <form>
            <TextField 
              value={this.state.name_create}
              onChange={e => this.setState({name_create: e.target.value})}
              className="item_name_create margin" 
              label="Name"
              margin="dense" />
            <TextField 
              value={this.state.barcode_create}
              onChange={e => this.setState({barcode_create: e.target.value})}              
              className="item_barcode_create margin" 
              label="Barcode number"
              margin="dense" />
            <TextField 
              value={this.state.expiration_date_create}
              onChange={e => this.setState({expiration_date_create: e.target.value})}               
              className="item_expiration_date_create margin" 
              label="Expiration date"
              margin="dense" />
            <TextField 
              value={this.state.count_create}
              onChange={e => this.setState({count_create: e.target.value})}               
              className="item_count_create margin" 
              label="Count"
              margin="dense" />
            <InputLabel id="select_container_label">Container</InputLabel>
            <Select 
              labelId="select_container_label"
              value={this.state.container_create} 
              onChange={e => this.setState({container_create: e.target.value})} 
              className="item_container_create margin" 
              label="Container">
              {this.containers.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </form>
          <Button className="btn_add_item" onClick={this.onClickAddItemButton}>Add</Button>
        </Container>
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