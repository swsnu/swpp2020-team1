import React, { Component } from 'react';
import './Result.css';
import EditItem from './EditItem';

class Result extends Component {
  render() {
    return (
      <div className="Result">
        <div className="Header"></div>
        <EditItem isAddItem={this.props.isAddItem} 
          onClickRetakeBarcode={this.props.onClickRetakeBarcode} 
          onClickRetakeExpirationDate={this.props.onClickRetakeExpirationDate}
          onClickFinishEditItem={this.props.onClickFinishEditItem}
          onChangeEditItem={this.props.onChangeEditItem}
          item={this.props.item} />
        <div display="flex" flex-direction="row">
        </div>
      </div>
    )
  }
}

export default (Result);