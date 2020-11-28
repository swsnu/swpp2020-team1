import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, Container, Button, TextField, Select, InputLabel, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Card, Grid } from "@material-ui/core";
import * as actionCreators from '../../store/actions/index';
import EditItem from '../../components/AddItem/EditItem';
import './ItemConfirm.css';

class ItemConfirm extends Component {
  containers = ['freezer', 'fridge', 'shelf'];
  state = {
    name_create: '',
    barcode_create: '',
    expiration_date_create: '',
    category_name_create: '',
    container_create: this.containers[0],
    count_create: 0,

    items: [],
    editDialogOpen: false,
    editingItemIdx: 0,
    
  }

  componentDidMount() {
    // this.props.onGetCategories();
    this.setState({items: this.props.location.state ? this.props.location.state.items : []});
  }

  // validateInputs() {
  //   return true;
  // }

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

  onConfirmEditButton = (edit) => {
    // if (!this.validateInputs()) {
    //   // set error message below input field
    //   return;
    // }
    this.setState({
      items: this.state.items.map((item, idx) => {
        if (idx === this.state.editingItemIdx) {
          return {
            'name': edit.name, 
            'barcode_num': edit.barcode_num, 
            'expiration_date': edit.expiration_date,
            'category_id': edit.category_id, 
            'category_name': edit.category_name,
            'container': edit.container, 
            'count': parseInt(edit.count)
          };
        } else {
          return item;
        }
      }),
      editDialogOpen: false});
  }
  
  onClickAddItemButton = () => {
    // if (!this.validateInputs()) {
    //   // set error message below input field 
    //   return;
    // }
    this.setState({
      items: this.state.items.concat({
        'name': this.state.name_create, 
        'barcode_num': this.state.barcode_create, 
        'expiration_date': this.state.expiration_date_create,
        'category_id': 1,
        'category_name': this.state.category_name_create, 
        'container': this.state.container_create, 
        'count': parseInt(this.state.count_create)}),
      name_create: '',
      barcode_create: '',
      expiration_date_create: '',
      category_create: 0,
      container_create: this.containers[0],
      count_create: 0,
    });
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
          <EditItem result={this.state.item_edit} onCancelEdit={this.onCancelEditButton} onConfirmEdit={this.onConfirmEditButton}></EditItem>
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
            <InputLabel id="select_category_create_label">Category</InputLabel>
            <TextField 
              labelid="select_category_name_create_label"
              value={this.state.category_name_create} 
              onChange={e => this.setState({category_name_create: e.target.value})} 
              className="item_category_name_create margin" 
              label="Category">
            </TextField>
            <InputLabel id="select_container_label">Container</InputLabel>
            <Select 
              
              labelid="select_container_label"
              value={this.state.container_create} 
              onChange={e => {this.setState({container_create: e.target.value}); console.log("set container")}} 
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