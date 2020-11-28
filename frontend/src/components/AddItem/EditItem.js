import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

// material-ui components
import { Button, TextField, DialogTitle, DialogContent, DialogActions, MenuItem, InputLabel, Select } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

class EditItem extends Component {
  containers = ['freezer', 'fridge', 'shelf'];
  category = [
    {name: '우유'},
    {name: '과자'}
  ]

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

    if(this.props.categories.length < 1) {
     this.props.onGetCategories();
    }
  }

  onCategoryChange = (event, value) => {
    if (value.name) { // value is object {id, name}
      console.log("value: " + JSON.stringify(value))
      this.setState({
        category_id: value.id,
        category_name: value.name,
      })
    } else {
      const found = this.props.categories.find(elem => elem.name === value)
      if (found) {
        this.setState({
          category_id: found.id,
          category_name: found.name // value is string (custom category)
        })
      } else {
        this.setState({
          category_id: 0,
          category_name: value
        })
      }
    }
  }

  render() {
    return (
      <Fragment>
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
            <Autocomplete
              options={this.props.categories}
              getOptionLabel={(option) => {return (option.name ? option.name : option)}}
              id="auto-select"
              autoSelect
              freeSolo={true}
              onChange={this.onCategoryChange}
              renderInput={(params) =>
                <TextField {...params}
                  label="Category" margin="normal" />}/>
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
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    categories: state.category.categories
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onGetCategories: () => dispatch(actionCreators.getCategories())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItem);