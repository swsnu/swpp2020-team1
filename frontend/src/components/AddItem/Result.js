import React, { Component } from 'react';
import './Result.css';
import EditItem from './EditItem';
import { connect } from 'react-redux';

class Result extends Component {
  render() {
    const result = this.props.result
    return (
      <div className="Result">
        <div className="Header"></div>
        <EditItem isAddItem={this.props.isAddItem} 
          onClickRetakeBarcode={this.props.onClickRetakeBarcode} 
          onClickRetakeExpirationDate={this.props.onClickRetakeExpirationDate}
          onClickEditItem={this.props.onClickEditItem}
          id={this.props.resultList.length - 1} />
        <div display="flex" flex-direction="row">
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    resultList: state.additem.resultList
  };
}

export default connect(mapStateToProps, null)(Result);