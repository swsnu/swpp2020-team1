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

import './EditItem.css';

const theme = createMuiTheme({
  typography: {
    fontFamily: `"Source Code Pro", "Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 11
   }
});

const style = {
  marginTop: "0px", 
  marginBottom: "0px",
}

class EditItem extends Component {
  containers = ['freezer', 'fridge', 'shelf'];
  categories = []

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

    //let expiration_date = new Date(info.expiration_date);
    //if (expiration_date.toString() === "Invalid Date") expiration_date = Date.now();
    this.setState({
      name: info.name ? info.name : '',
      barcode_num: info.barcode_num ? info.barcode_num : '',
      expiration_date: info.expiration_date ? info.expiration_date : '',
      category_id: info.category_id ? info.category_id : 0,
      category_name: info.category_name ? info.category_name : '',
      count: info.count ? info.count : 1,
      container: info.container ? info.container : this.containers[0],
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
      this.setState({
        category_id: value.id,
        category_name: value.name,
      })
    } else {
      const found = this.categories.find(elem => elem.name === value)
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
        <div className="EditItem">
          <ThemeProvider theme={theme}><table><tbody>
            <tr>
              <td className="tableContentName">Name</td>
              <td className="tableContent">
                <TextField fullWidth={true} style={style}
                  error={this.state.name === "" ? true : false}
                  value={this.state.name}
                  helperText={/*this.state.name === "" ? "이름을 입력해주세요" : ""*/""}
                  onChange={e => {this.setState({ name: e.target.value }); this.checkValidity(e.target.value, this.state.expiration_date)}}
                  className="item_name_edit margin" 
                  margin="dense" />
              </td>
              <td></td>
            </tr>
            <tr>
              <td className="tableContentName">Barcode Number</td>
              <td className="tableContent">
                <TextField fullWidth={true} style={style}
                  value={this.state.barcode_num}
                  onChange={e => this.setState({ barcode_num: e.target.value })}
                  className="item_barcode_edit margin" 
                  margin="dense" />
              </td>
              <td></td>
            </tr>
            <tr>
              <td className="tableContentName">Expiration Date</td>
              <td className="tableContent">
                <MuiPickersUtilsProvider utils={DateFnsUtils} style={style}>
                  <KeyboardDatePicker
                    openTo="year"
                    format="yyyy/MM/dd"
                    views={["year", "month", "date"]}
                    value={this.state.expiration_date === '' ? Date.now() : this.state.expiration_date}
                    onChange={(date) => {this.setState({expiration_date: date}); this.checkValidity(this.state.name, date)}}
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
                  value={this.state.category_name}
                  options={this.categories}
                  getOptionLabel={(option) => {return (option.name ? option.name : option)}}
                  id="auto-select"
                  autoSelect
                  freeSolo={true}
                  onChange={this.onCategoryChange}
                  renderInput={(params) =>
                    <TextField {...params} style={style} />}/>
              </td>
              <td></td>
            </tr>
          </tbody></table></ThemeProvider>
          <div className="EditItemContent">
            <div className="Count">
              <RemoveIcon className="Button" style={{ color: "#FFFFFF" }} />
              <TextField 
                type="number"
                value={this.state.count}
                onChange={e => e.target.value >= 1 ? this.setState({ count: e.target.value }) : null}
                className="item_count_edit margin" 
                label="Count"
                margin="dense" />
              <AddIcon className="Button" style={{ color: "#FFFFFF" }} />  
            </div>
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
          </div>
        </div>
        {/*<DialogActions>
          <Button className="btn_cancel_edit" onClick={this.props.onCancelEdit}>Cancel</Button>
          <Button className="btn_confirm_edit" onClick={() => this.props.onConfirmEdit({...this.state})}>Ok</Button>
        </DialogActions>*/}
      </Fragment>
    )
  }
}

export default EditItem;