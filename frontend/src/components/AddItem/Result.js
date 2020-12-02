import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import './Result.css';
import EditItem from './EditItem';

class Result extends Component {
  render() {
    const result = this.props.result
    return (
      <div className="Result">
        <EditItem itemInfo={result} />
        <div display="flex" flex-direction="row">
          <Button id="onClickRetakeBarcodeButton" onClick={this.props.onClickRetakeBarcode} >Retake Barcode</Button>
          <Button id="onClickRetakeExpirationDateButton" onClick={this.props.onClickRetakeExpirationDate} >Retake Expiration Date</Button>
        </div>
      </div>
    )
  }
}

export default Result;