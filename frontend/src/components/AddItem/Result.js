import React, { Component } from 'react';
import { Typography, Container, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, InputLabel, Select } from '@material-ui/core';
import './Result.css';

class Result extends Component {
  render() {
    const result = this.props.result
    return (
      <React.Fragment>
        <div className="Result">
          <p id='barcode_num'> <b>Barcode:</b> {result.barcode_num} </p>
          <p id='name'> <b>Name:</b> {result.name} </p>
          <p id='category_name'> <b>Category:</b> {result.category_name} </p>
          <p id='expiration_date'> <b>Expiration Date:</b> {result.expiration_date} </p>
          <p id='container'> <b>Container:</b> {result.container} </p>
          <Button id="onClickCountMinusButton" onClick={this.props.onClickCountMinus}> - </Button>
          {result.count}
          <Button id="onClickCountPlusButton" onClick={this.props.onClickCountPlus}> + </Button>
        </div>
        <div>
          Problem with Barcode?
          <Button id="onClickRetakeBarcodeButton" onClick={this.props.onClickRetakeBarcode} >Retake</Button>
        </div>
        <div>
          Problem with Expiration Date?
          <Button id="onClickRetakeExpirationDateButton" onClick={this.props.onClickRetakeExpirationDate} >Retake</Button>
        </div>
        <div>
          Want to Edit Manually?
          <Button id="onClickEditButton" onClick={this.props.onClickEdit} >Edit</Button>
        </div>
      </React.Fragment>
    )
  }
}

export default Result;