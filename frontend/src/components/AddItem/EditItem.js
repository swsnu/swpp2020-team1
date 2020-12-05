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
    if (info.expiration_date === "-") {
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
    if (value && value.name) { // value is object {id, name}
      console.log("value: " + JSON.stringify(value))
      this.setState({ item: { ...this.state.item, category_id: value.id, category_name: value.name }});
      this.props.onUpdateItemList(this.props.id, { category_id: value.id, category_name: value.name });
    } else {
      const found = this.categories.find(elem => elem.name === value)
      if (found) {
        this.setState({ item: { ...this.state.item, category_id: found.id, category_name: found.name }});
        this.props.onUpdateItemList(this.props.id, { category_id: found.id, category_name: found.name }); // value is string (custom category)
      } else {
        this.setState({ item: { ...this.state.item, category_id: 0, category_name: value }});
        this.props.onUpdateItemList(this.props.id, { category_id: 0, category_name: value });
      }
    }
  }

  checkValidity = (name, expiration_date) => {
    if (name === '' || expiration_date.toString() === 'Invalid Date') {
      this.setState({valid: false})
    } else {
      this.setState({valid: true})
      console.log("valid true");
    }
  }

  render() {
    const {classes} = this.props;
    console.log(this.state.item);
    return (
      <Fragment>
        <div className="EditItem">
          <table><tbody>
            <tr>
              <td className="tableContentName">이름</td>
              <td className="tableContent">
                <TextField fullWidth={true} style={style}
                  error={!this.state.valid}
                  value={this.props.resultList[this.props.id].name /*this.state.item.name*/}
                  onChange={e => { this.setState({item: {...this.state.item, name: e.target.value}}); 
                                   this.props.onUpdateItemList(this.props.id, { name: e.target.value }); 
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
                  value={this.props.resultList[this.props.id].barcode_num}
                  onChange={e => {this.setState({ item: { ...this.state.item, barcode_num: e.target.value }}); 
                                  this.props.onUpdateItemList(this.props.id, { barcode_num: e.target.value });}}
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
                    views={["year", "month", "date"]}
                    value={this.state.disableExpirationField ? null : this.props.resultList[this.props.id].expiration_date}
                    onChange={(date) => { this.setState({ item: {...this.state.item, expiration_date: date }}); 
                                          this.props.onUpdateItemList(this.props.id, { expiration_date: date }); 
                                          this.checkValidity(this.state.item.name, date)}}
                  />           
                </MuiPickersUtilsProvider>
              </td>
              <td className="Checkbox">
                <Checkbox
                  checked={!this.state.disableExpirationField}
                  onChange={() => {this.setState({ disableExpirationField: !this.state.disableExpirationField, })}}
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
                  value={this.props.resultList[this.props.id].category_name}
                  options={this.categories}
                  getOptionLabel={(option) => {return (option.name ? option.name : option)}}
                  id="auto-select"
                  autoSelect
                  freeSolo={true}
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
                onClick={() => {if(this.props.resultList[this.props.id].count > 1) { this.setState({ item: {...this.state.item, count: (this.state.item.count - 1) }});
                                                                    this.props.onUpdateItemList(this.props.id, { count: (this.props.resultList[this.props.id].count - 1) }); }}} />
              <TextField 
                value={this.props.resultList[this.props.id].count}
                onChange={e => {this.setState({item: {...this.state.item, count: e.target.value}});
                                this.props.onUpdateItemList(this.props.id, { count: e.target.value });}}
                className="item_count_edit margin"
                inputProps={{style: { textAlign: "center" }}}
                InputProps={{classes: {input: classes.typography} }} 
                style={style}
                margin="dense" />
              <AddIcon className="Button" style={{ color: "#FFFFFF" }} 
                onClick={() => {this.setState({item: {...this.state.item, count: (this.state.item.count + 1) }});
                                this.props.onUpdateItemList(this.props.id, { count: (this.props.resultList[this.props.id].count + 1) }); }} />  
            </div>
            <Select 
              labelId="select_container_label"
              value={this.props.resultList[this.props.id].container}
              onChange={e => {this.setState({item: {...this.state.item, container: e.target.value}});
                              this.props.onUpdateItemList(this.props.id, { container: e.target.value });} }
              className="item_container_edit margin" 
              label="Container">
              {this.containers.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
            {this.props.isAddItem ? 
              null : <button onClick={this.props.onClickEditItem}>추가</button>}
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
