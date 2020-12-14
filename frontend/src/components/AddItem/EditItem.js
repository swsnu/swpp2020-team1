import React, { Component, Fragment } from "react";

// material-ui components
import { TextField, MenuItem, Select, Checkbox } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

import axios from 'axios';

import './EditItem.css';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const style = {
  marginTop: "0px", 
  marginBottom: "0px",
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#7DBF1A',
      dark: '#7DBF1A',
      light: '#7DBF1A',
      contrastText: "#fff"
    },
  },
});

const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typography: {
    fontFamily: ['Noto Sans KR', 'sans-serif', 'Roboto'].join(','), 
    fontSize: 14,
  },
  button: {
    margin: theme.spacing(1),
  },
});

class EditItem extends Component {
  containers = ['freezer', 'fridge', 'shelf'];
  categories = []

  state = {
    valid: false,
    disableExpirationField: false
  }

  componentDidMount() {
    const info = this.props.item;
    //this.checkValidity(info.name, info.expiration_date);

    if (info.expiration_date == null) {
      this.setState({disableExpirationField: true})
    }

    //let expiration_date = new Date(info.expiration_date);
    //if (expiration_date.toString() === "Invalid Date") expiration_date = Date.now();

    if(this.categories.length < 1) {
      axios.get(`/back/category/`)
      .then(res => {
        if (res) this.categories = res.data
      })
    }
  }

  onCategoryChange = (event, value) => {
    console.log("onCategoryChange!!!")
    if (value && value.name) { // value is object {id, name}
      console.log("value: " + JSON.stringify(value))
      this.props.onChangeEditItem({
        category_id: value.id,
        category_name: value.name
      })
     // this.setState({ item: { ...this.props.item, category_id: value.id, category_name: value.name }});
    } else {
      const found = this.categories.find(elem => elem.name === value)
      if (found) {
        this.props.onChangeEditItem({
          category_id: found.id,
          category_name: found.name
        })
        //this.setState({ item: { ...this.props.item, category_id: found.id, category_name: found.name }}); // value is string (custom category)
      } else {
        this.props.onChangeEditItem({
          category_id: 0,
          category_name: value
        })
        //this.setState({ item: { ...this.props.item, category_id: 0, category_name: value }});
      }
    }
  }

  checkValidity = (name, expiration_date) => {
    if (name === '' || (!this.state.disableExpirationField && (expiration_date === null || expiration_date == 'Invalid Date'))) {
      return false;
    } else {
      return true;
    }
  }

  onClickEditItemButton = () => {
    this.props.onClickFinishEditItem();    
  }

  render() {
    const {classes} = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <Card className={classes.root}>
      {/* <Fragment> */}
        <div className="EditItem">
          <table><tbody>
            <tr>
              <td className="tableContentName">이름</td>
              <td className="tableContent">
                <TextField fullWidth={true} style={style}
                  error={this.props.item.name === ''}
                  value={this.props.item.name}
                  onChange={e => { this.props.onChangeEditItem({name: e.target.value}); }}
                  className="item_name_edit margin" 
                  margin="dense"
                  InputProps={{classes: {input: classes.typography} }} />
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="tableContentName">바코드</td>
              <td className="tableContent">
                <TextField fullWidth={true} style={style}
                  value={this.props.item.barcode_num}
                  onChange={e => {this.props.onChangeEditItem({ barcode_num: e.target.value }); }}
                  className="item_barcode_edit margin" 
                  margin="dense"
                  InputProps={{
                    classes: {
                      input: classes.typography
                    }
                  }} />
              </td>
              <td></td>
              <td>
                {this.props.isAddItem ? 
                  <div className="retakeButton" onClick={this.props.onClickRetakeBarcode}>다시</div> :
                  null}
              </td>
            </tr>
            <tr>
              <td className="tableContentName">유통기한</td>
              <td className="tableContent">
                <MuiPickersUtilsProvider utils={DateFnsUtils} style={style} >
                  <KeyboardDatePicker
                    InputProps={{classes: {input: classes.typography}}}
                    openTo="year"
                    format="yyyy/MM/dd"
                    className="item_expiration_date_edit"
                    views={["year", "month", "date"]}
                    value={this.state.disableExpirationField ? null : this.props.item.expiration_date }
                    onChange={(date) => { this.props.onChangeEditItem({ expiration_date: date }); }}
                  />           
                </MuiPickersUtilsProvider>
              </td>
              <td className="Checkbox">
                <Checkbox
                  checked={!this.state.disableExpirationField}
                  onChange={() => { let checkBoxExpDate = this.state.disableExpirationField ? Date(Date.now()) : null;
                                    this.props.onChangeEditItem({ expiration_date: checkBoxExpDate });
                                    this.setState({ disableExpirationField: !this.state.disableExpirationField }); }}
                  color="primary"
	    	          style={{padding: "0 0 0 0", height: "20px", width: "20px"}} />
              </td>
              <td>
                {this.props.isAddItem ? 
                  <div className="retakeButton" onClick={this.props.onClickRetakeExpirationDate}>다시</div> :
                  null}
              </td>
            </tr>
            <tr>
              <td className="tableContentName">항목</td>
              <td className="tableContent">
                <Autocomplete style={style} fullWidth={true}
                  value={this.props.item.category_name}
                  onChange={this.onCategoryChange}
                  options={this.categories}
                  getOptionLabel={(option) => {return (option.name ? option.name : option)}}
                  id="auto-select"
                  autoSelect
                  freeSolo={true}
                  className="item_category_name_edit"
                  renderInput={(params) =>
                    <TextField {...params} style={style} InputProps={{ ...params.InputProps, style: {fontSize: 14, fontFamily: "Noto Sans KR"} }} />}/>
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody></table>
          <div className="EditItemContent">
            <div style={{fontFamily: '"Noto Sans KR", sans-serif', fontSize: 13, color: "#949494"}}>수량</div>
            <div className="Count">
              <RemoveIcon id="EditItemMinusButton" className="Button" style={{ color: "#FFFFFF" }} 
                onClick={() => {if(this.props.item.count > 1) { this.props.onChangeEditItem({ count: (this.props.item.count - 1) })} }} />
              <TextField 
                value={this.props.item.count}
                onChange={e => {this.props.onChangeEditItem({ count: e.target.value })}}
                className="item_count_edit margin"
                inputProps={{style: { textAlign: "center" }}}
                InputProps={{classes: {input: classes.typography} }} 
                style={style}
                margin="dense" />
              <AddIcon id="EditItemPlusButton" className="Button" style={{ color: "#FFFFFF" }} 
                onClick={() => {this.props.onChangeEditItem({ count: (this.props.item.count + 1) })}} />  
            </div>
            <Select 
              labelId="select_container_label"
              value={this.props.item.container}
              onChange={e => {this.props.onChangeEditItem({ container: e.target.value })}}
              className="item_container_edit margin" 
              label="Container">
              {this.containers.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
            <Button
              id="FinishEditButton"
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<AddShoppingCartIcon />}
              disabled={!this.checkValidity(this.props.item.name, this.props.item.expiration_date)}
              onClick={this.onClickEditItemButton}
            >
              ADD
            </Button>
          </div>
        </div>
      {/* </Fragment> */}
      </Card>
      </MuiThemeProvider>
    )
  }
}

export default (withStyles(styles)(EditItem));
