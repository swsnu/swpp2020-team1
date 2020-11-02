import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router';

class AddItem extends Component {
  onClickAddItemButton = () => {

  }
  render() {
    return (
      <div className="AddItem">
        <button className="btn_add_item" onClick={()=>this.onClickAddItemButton()}>Add Item</button>
      </div>
     );
  }
}

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddItem));