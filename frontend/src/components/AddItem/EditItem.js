import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

// material-ui components
import { Button, TextField, DialogTitle, DialogContent, DialogActions, MenuItem, InputLabel, Select } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


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
    container: '' ,
    valid: true
  }

  componentDidMount() {
    const info = this.props.itemInfo

    let expiration_date = new Date(info.expiration_date);
    if (expiration_date.toString() === "Invalid Date") expiration_date = Date.now();
    this.setState({
      name: info.name ? info.name : '',
      barcode_num: info.barcode_num ? info.barcode_num : '',
      expiration_date: expiration_date,
      category_id: info.category_id ? info.category_id : 0,
      category_name: info.category_name ? info.category_name : '',
      count: info.count ? info.count : 1,
      container: info.container ? info.container : this.containers[0],
      valid: info.name !== ''
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

  checkValidity = (name, expiration_date) => {
    if (name === '' || expiration_date.toString() === 'Invalid Date') {
      this.setState({valid: false})
      console.log("invalid")
    } else {
      this.setState({valid: true})
      console.log("valid")
    }
  }

  render() {
    return (
      <Fragment>
        <DialogTitle id="edit_dialog_title">Edit your item</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              error={this.state.name === "" ? true : false}
              value={this.state.name}
              helperText={this.state.name === "" ? "이름을 입력해주세요" : ""}
              onChange={e => {this.setState({ name: e.target.value }); this.checkValidity(e.target.value, this.state.expiration_date)}}
              className="item_name_edit margin" 
              label="Name"
              margin="dense" />
            <TextField 
              value={this.state.barcode_num}
              onChange={e => this.setState({ barcode_num: e.target.value })}
              className="item_barcode_edit margin" 
              label="Barcode number"
              margin="dense" />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                openTo="year"
                format="yyyy/MM/dd"
                label="Expiration date"
                views={["year", "month", "date"]}
                value={this.state.expiration_date === '' ? Date.now() : this.state.expiration_date}
                onChange={(date) => {this.setState({expiration_date: date}); this.checkValidity(this.state.name, date)}}
              />           
            </MuiPickersUtilsProvider>
            <TextField 
              type="number"
              value={this.state.count}
              onChange={e => e.target.value >= 1 ? this.setState({ count: e.target.value }) : null}
              className="item_count_edit margin" 
              label="Count"
              margin="dense" />
            <Autocomplete
              value={this.state.category_name}
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
          <Button className="btn_confirm_edit" onClick={() => this.props.onConfirmEdit({...this.state})}>Ok</Button>
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