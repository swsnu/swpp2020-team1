import React, { Component } from 'react';
import AddItem from './AddItem';

class Result extends Component {
  render() {
    const result = this.props.result
    if (!result) { return null }
    return (
      <React.Fragment>
        <div>
          <li> Barcode: {result.barcode_num} </li>
          <li> Name: {result.name} </li>
          <li> Category: {result.category_id} </li>
          <li> Expiration Date: {result.expiration_date} </li>
        </div>
        <div>
          <button onClick={this.props.onClickMinusButton}> - </button>
          {result.count}
          <button onClick={this.props.onClickPlusButton}> + </button>
        </div>
        <div>
          Problem with Barcode?
          <button onClick={this.props.onClickRetakeBarcodeButton} >Retake</button>
        </div>
        <div>
          Problem with Expiration Date?
          <button onClick={this.props.onClickRetakeExpirationDateButton} >Retake</button>
        </div>
        <div>
          Want to Edit Manually?
          <button onClick={this.props.onClickEditButton} >Edit</button>
        </div>
      </React.Fragment>
    )
  }
}

export default Result;