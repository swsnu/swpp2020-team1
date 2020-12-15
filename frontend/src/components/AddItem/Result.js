import React, { Component } from 'react';
import './Result.css';
import EditItem from './EditItem';

class Result extends Component {
  render() {
    const result = this.props.result
    return (
      <div className="Result">
        <div className="Header"></div>
        <EditItem isAddItem={this.props.isAddItem} 
          onClickRetakeBarcode={this.props.onClickRetakeBarcode} 
          onClickRetakeExpirationDate={this.props.onClickRetakeExpirationDate}
          onClickFinishEditItem={this.props.onClickFinishEditItem}
          onChangeEditItem={this.props.onChangeEditItem}
          item={this.props.item}
          expiration_date_loading={this.props.expiration_date_loading} />
        <div display="flex" flex-direction="row">
        </div>
      </div>
    )
  }
}

export default (Result);