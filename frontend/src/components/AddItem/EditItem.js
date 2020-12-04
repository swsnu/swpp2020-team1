import React, { Component, Fragment } from "react";

// material-ui components
import { Button, TextField, DialogTitle, DialogContent, DialogActions, MenuItem, InputLabel, Select } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

import axios from 'axios';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

import './EditItem.css';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  typography: {
    fontFamily: `"Source Code Pro", "Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 12
  }
}

const style = {
  marginTop: "0px", 
  marginBottom: "0px",
}

class EditItem extends Component {
  containers = ['freezer', 'fridge', 'shelf'];
  categories = []

  state = {
    valid: true
  }

  componentDidMount() {
    const info = this.props.itemInfo;

    //let expiration_date = new Date(info.expiration_date);
    //if (expiration_date.toString() === "Invalid Date") expiration_date = Date.now();
    this.setState({
      valid: info.name !== ''
    })

    if(this.categories.length < 1) {
      axios.get(`/back/category/`)
      .then(res => {
        if (res) this.categories = res.data
      })
    }
  }

  onCategoryChange = (event, value) => {
    if (value && value.name) { // value is object {id, name}
      console.log("value: " + JSON.stringify(value))
      this.props.onUpdateCurrentItem({ category_id: value.id, category_name: value.name });
    } else {
      const found = this.categories.find(elem => elem.name === value)
      if (found) {
        this.props.onUpdateCurrentItem({ category_id: found.id, category_name: found.name }); // value is string (custom category)
      } else {
        this.props.onUpdateCurrentItem({ category_id: 0, category_name: value });
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
    const {classes} = this.props;
    return (
      <Fragment>
        <div className="EditItem">
          <table><tbody>
            <tr>
              <td className="tableContentName">Name</td>
              <td className="tableContent">
                <TextField fullWidth={true} style={style}
                  error={this.props.itemInfo.name === "" ? true : false}
                  value={this.props.itemInfo.name}
                  helperText=""
                  onChange={e => { this.props.onUpdateCurrentItem({ name: e.target.value }); this.checkValidity(e.target.value, this.props.itemInfo.expiration_date)}}
                  className="item_name_edit margin" 
                  margin="dense"
                  InputProps={{
                    classes: {
                      input: classes.typography
                    }
                  }} />
              </td>
              <td></td>
            </tr>
            <tr>
              <td className="tableContentName">Barcode Number</td>
              <td className="tableContent">
                <TextField fullWidth={true} style={style}
                  value={this.props.itemInfo.barcode_num}
                  onChange={e => {this.props.onUpdateCurrentItem({ barcode_num: e.target.value });}}
                  className="item_barcode_edit margin" 
                  margin="dense"
                  InputProps={{
                    classes: {
                      input: classes.typography
                    }
                  }} />
              </td>
              <td></td>
            </tr>
            <tr>
              <td className="tableContentName">Expiration Date</td>
              <td className="tableContent">
                <MuiPickersUtilsProvider utils={DateFnsUtils} style={style} >
                  <KeyboardDatePicker
                    InputProps={{classes: {input: classes.typography}}}
                    openTo="year"
                    format="yyyy/MM/dd"
                    views={["year", "month", "date"]}
                    value={this.props.itemInfo.expiration_date === '' ? Date.now() : this.props.itemInfo.expiration_date}
                    onChange={(date) => { this.props.onUpdateCurrentItem({ expiration_date: date }); this.checkValidity(this.props.itemInfo.name, date)}}
                  />           
                </MuiPickersUtilsProvider>
              </td>
              <td className="Checkbox">
                <Checkbox style={{padding: "0 0 0 0"}}></Checkbox>
              </td>
            </tr>
            <tr>
              <td className="tableContentName">Category</td>
              <td className="tableContent">
                <Autocomplete style={style} fullWidth={true}
                  value={this.props.itemInfo.category_name}
                  options={this.categories}
                  getOptionLabel={(option) => {return (option.name ? option.name : option)}}
                  id="auto-select"
                  autoSelect
                  freeSolo={true}
                  onChange={this.onCategoryChange}
                  renderInput={(params) =>
                    <TextField {...params} style={style} InputProps={{ ...params.InputProps, style: {fontSize: 13} }} />}/>
              </td>
              <td></td>
            </tr>
          </tbody></table>
          <div className="EditItemContent">
            <div className="Count">
              <RemoveIcon className="Button" style={{ color: "#FFFFFF" }} />
              <TextField 
                type="number"
                value={this.props.itemInfo.count}
                onChange={e => {this.props.onUpdateCurrentItem({ count: e.target.value });}}
                className="item_count_edit margin" 
                label="Count"
                margin="dense" />
              <AddIcon className="Button" style={{ color: "#FFFFFF" }} />  
            </div>
            <Select 
              labelId="select_container_label"
              value={this.props.itemInfo.container}
              onChange={e => this.props.onUpdateCurrentItem({ container: e.target.value })}
              className="item_container_edit margin" 
              label="Container">
              {this.containers.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    itemInfo: state.additem.currentResult
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdateCurrentItem: (item) => dispatch(actionCreators.updateCurrentItem(item))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditItem));