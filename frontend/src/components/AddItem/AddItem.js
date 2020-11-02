import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router';

class AddItem extends Component {
  render() {
    return (
      <div className="AddItem">
        
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