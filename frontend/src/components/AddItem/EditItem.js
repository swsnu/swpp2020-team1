import React, { Component, Fragment } from "react";

// material-ui components
import { TextField, MenuItem, Select, Checkbox } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

import axios from 'axios';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

import './EditItem.css';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  typography: {
    fontFamily: `"Noto Sans KR", "Source Code Pro", "Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 14
  }
}

const style = {
  marginTop: "0px", 
  marginBottom: "0px",
}

class EditItem extends Component {
  containers = ['freezer', 'fridge', 'shelf'];
  categories = []

  defaultResult = {
    name: '',
    container: 'freezer',
    category_id: 0,
    category_name: '기타',
    barcode_num: '',
    expiration_date: Date.now(),
    count: 1
  }

  state = {
    valid: false,
    disableExpirationField: false,
    item: this.defaultResult
  }

  componentDidMount() {
    const info = this.props.resultList[this.props.id];
    if (info.expiration_date == null) {
      this.setState({disableExpirationField: true})
    }

    this.setState({ item: info });

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
    console.log("here")
    if (value && value.name) { // value is object {id, name}
      console.log("value: " + JSON.stringify(value))
      this.setState({ item: { ...this.state.item, category_id: value.id, category_name: value.name }});
    } else {
      const found = this.categories.find(elem => elem.name === value)
      if (found) {
        this.setState({ item: { ...this.state.item, category_id: found.id, category_name: found.name }}); // value is string (custom category)
      } else {
        this.setState({ item: { ...this.state.item, category_id: 0, category_name: value }});
      }
    }
  }

  checkValidity = (name, expiration_date) => {
    console.log(this.state.disableExpirationField, expiration_date, 'wow')
    if (name === '' || (!this.state.disableExpirationField && (expiration_date === null || expiration_date == 'Invalid Date'))) {
      this.setState({valid: false})
    } else {
      this.setState({valid: true})
    }
  }

  onClickEditItemButton = () => {
    //  this.state.disableExpirationField: true일때 ,
    // expiration_date: Date.now(),
    
    //if(this.props.onClickEditItem) {
      this.props.onUpdateItemList(this.props.id, this.state.item);
      this.props.onClickEditItem();    
    //}
    
    this.setState({item: {...this.state.item, name: '', barcode_num: '', expiration_date: null, category_id: 0, category_name: '기타', count: 1, container: 'freezer' }});
  }

  render() {
    const {classes} = this.props;
    return (
      <Fragment>
        <div className="EditItem">
          <table><tbody>
            <tr>
              <td className="tableContentName">이름</td>
              <td className="tableContent">
                <TextField fullWidth={true} style={style}
                  error={this.state.item.name === ''}
                  value={this.state.item.name}
                  onChange={e => { this.setState({item: {...this.state.item, name: e.target.value}}); 
                                   this.checkValidity(e.target.value, this.state.item.expiration_date)}}
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
                  value={this.state.item.barcode_num}
                  onChange={e => {this.setState({ item: { ...this.state.item, barcode_num: e.target.value }}); }}
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
                    value={this.state.disableExpirationField ? null : this.state.item.expiration_date }
                    onChange={(date) => { this.setState({ item: {...this.state.item, expiration_date: date }}); 
                                          this.checkValidity(this.state.item.name, date);
                                          console.log(date);}}
                  />           
                </MuiPickersUtilsProvider>
              </td>
              <td className="Checkbox">
                <Checkbox
                  checked={!this.state.disableExpirationField}
                  onChange={() => { console.log('at checkbox', this.state.disableExpirationField)
                                    let checkBoxExpDate = this.state.disableExpirationField ? Date(Date.now()) : null;
                                    Promise.resolve()
                                    .then(() => {
                                      this.setState({ item: { ...this.state.item, expiration_date: checkBoxExpDate },
                                                      disableExpirationField: !this.state.disableExpirationField });
                                    })
                                    .then(() => {
                                      this.checkValidity(this.state.item.name, checkBoxExpDate);
                                    }) }}
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
                  value={this.state.item.category_name}
                  options={this.categories}
                  getOptionLabel={(option) => {return (option.name ? option.name : option)}}
                  id="auto-select"
                  autoSelect
                  freeSolo={true}
                  className="item_category_name_edit"
                  onChange={this.onCategoryChange}
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
              <RemoveIcon className="Button" style={{ color: "#FFFFFF" }} 
                onClick={() => {if(this.state.item.count > 1) { this.setState({ item: {...this.state.item, count: (this.state.item.count - 1) }}); }}} />
              <TextField 
                value={this.state.item.count}
                onChange={e => {this.setState({item: {...this.state.item, count: e.target.value}});}}
                className="item_count_edit margin"
                inputProps={{style: { textAlign: "center" }}}
                InputProps={{classes: {input: classes.typography} }} 
                style={style}
                margin="dense" />
              <AddIcon className="Button" style={{ color: "#FFFFFF" }} 
                onClick={() => {this.setState({item: {...this.state.item, count: (this.state.item.count + 1) }}); }} />  
            </div>
            <Select 
              labelId="select_container_label"
              value={this.state.item.container}
              onChange={e => {this.setState({item: {...this.state.item, container: e.target.value}}); }}
              className="item_container_edit margin" 
              label="Container">
              {this.containers.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
            <button disabled={!this.state.valid} onClick={this.onClickEditItemButton}>완료</button>
          </div>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    resultList: state.additem.resultList
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdateItemList: (id, item) => dispatch(actionCreators.updateItemList(id, item))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditItem));
