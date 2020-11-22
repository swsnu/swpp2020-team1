import React, { Component} from "react";

// material-ui components
import { Button, TextField, DialogTitle, DialogContent, DialogActions, MenuItem, InputLabel, Select } from '@material-ui/core';

class EditItem extends Component {
  containers = ['freezer', 'fridge', 'shelf'];

  state = {
    name: '', 
    barcode_num: '',
    expiration_date: '',
    category_name: '',
    category_id: 0,
    count: '',
    container: '' 
  }

  componentDidMount() {
    const result = this.props.result

    let updatedResult = {
      name: (result.name ? result.name : '') ,
      barcode_num: (result.barcode_num ? result.barcode_num : ''),
      expiration_date: (result.expiration_date ? result.expiration_date : ''),
      category_name: (result.category_name ? result.category_name : ''),
      count: (result.count ? result.count : 1),
      container: (result.container ? result.container : this.containers[0])
    }
    
    this.setState({
      name: updatedResult.name,
      barcode_num: updatedResult.barcode_num,
      expiration_date: updatedResult.expiration_date,
      category_name: updatedResult.category_name,
      count: updatedResult.count,
      container: updatedResult.container
    })
  }

  render() {
    return (
      <React.Fragment>
        <DialogTitle id="edit_dialog_title">Edit your item</DialogTitle>
        <DialogContent>
          <form>
            <TextField 
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
              className="item_name_edit margin" 
              label="Name"
              margin="dense" />
            <TextField 
              value={this.state.barcode_num}
              onChange={e => this.setState({ barcode_num: e.target.value })}
              className="item_barcode_edit margin" 
              label="Barcode number"
              margin="dense" />
            <TextField
              value={this.state.expiration_date}
              onChange={e => this.setState({ expiration_date: e.target.value })} 
              className="item_expiration_date_edit margin" 
              label="Expiration date"
              margin="dense" />
            <TextField 
              value={this.state.count}
              onChange={e => this.setState({ count: e.target.value })}
              className="item_count_edit margin" 
              label="Count"
              margin="dense" />
            <TextField 
              value={this.state.category_name}
              onChange={e => this.setState({ category_name: e.target.value })}               
              className="item_category_name_edit margin" 
              label="Category"
              margin="dense" />
            <InputLabel id="select_container_label">Container</InputLabel>
            <Select 
              labelId="select_container_label"
              value={this.state.container}
              onChange={e => this.setState({ container: e.target.value })}
              className="item_container_edit margin" 
              label="Container">
              {this.containers.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </form>
        </DialogContent>
        <DialogActions>
          <Button className="btn_cancel_edit" onClick={this.props.onCancelEdit}>Cancel</Button>
          <Button className="btn_confirm_edit" onClick={() => this.props.onConfirmEdit(this.state)}>Ok</Button>
        </DialogActions>
      </React.Fragment>
    )
  }
}

export default EditItem;