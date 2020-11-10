import React, { Component } from 'react';
import { Typography, Container, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, InputLabel, Select } from '@material-ui/core';
import './Result.css';

class Result extends Component {
  render() {
    const result = this.props.result
    if (!result) { return null }
    return (
      <React.Fragment>
        <div className="Result">
          <p> <b>Barcode:</b> {result.barcode_num} </p>
          <p> <b>Name:</b> {result.name} </p>
          <p> <b>Category:</b> {result.category_id} </p>
          <p> <b>Expiration Date:</b> {result.expiration_date} </p>
          <Button onClick={this.props.onClickMinusButton}> - </Button>
          {result.count}
          <Button onClick={this.props.onClickPlusButton}> + </Button>
        </div>
        <div>
          Problem with Barcode?
          <Button onClick={this.props.onClickRetakeBarcodeButton} >Retake</Button>
        </div>
        <div>
          Problem with Expiration Date?
          <Button onClick={this.props.onClickRetakeExpirationDateButton} >Retake</Button>
        </div>
        <div>
          Want to Edit Manually?
          <Button onClick={this.props.onClickEditButton} >Edit</Button>
        </div>
      </React.Fragment>
    )
  }
}

export default Result;