import React, { Component } from 'react';
import { Typography, Container, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, InputLabel, Select } from '@material-ui/core';
import './Result.css';

class Result extends Component {
  render() {
    const result = this.props.result
    return (
      <React.Fragment>
        <div className="Result">
          <p> <b>Barcode:</b> {result.barcode_num} </p>
          <p> <b>Name:</b> {result.name} </p>
          <p> <b>Category:</b> {result.category_name} </p>
          <p> <b>Expiration Date:</b> {result.expiration_date} </p>
          <p> <b>Container:</b> {result.container} </p>
          <Button id="onClickCountMinusButton" onClick={this.props.onClickCountMinusButton}> - </Button>
          {result.count}
          <Button id="onClickCountPlusButton" onClick={this.props.onClickCountPlusButton}> + </Button>
        </div>
        <div>
          Problem with Barcode?
          <Button id="onClickRetakeBarcodeButton" onClick={this.props.onClickRetakeBarcodeButton} >Retake</Button>
        </div>
        <div>
          Problem with Expiration Date?
          <Button id="onClickRetakeExpirationDateButton" onClick={this.props.onClickRetakeExpirationDateButton} >Retake</Button>
        </div>
        <div>
          Want to Edit Manually?
          <Button id="onClickEditButton" onClick={this.props.onClickEditButton} >Edit</Button>
        </div>
      </React.Fragment>
    )
  }
}

export default Result;