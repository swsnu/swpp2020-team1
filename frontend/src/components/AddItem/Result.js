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
        </div>
        <div>
          <button onClick={this.props.onClickEditButton} >Edit</button>
          <button onClick={this.props.onClickRemoveButton} >Remove</button>
        </div>
      </React.Fragment>
    )
  }
}

export default Result;