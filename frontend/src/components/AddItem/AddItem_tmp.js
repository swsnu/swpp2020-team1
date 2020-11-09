import React, { Component} from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Webcam from 'react-webcam';
import axios from 'axios';

// material-ui components
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import Scanner from './Scanner';
import Result from './Result';

const BARCODE_TERM = 'Scanning Barcode...'
const EXPIRATION_TERM = 'Scanning Expiration Date...'

class AddItem extends Component {
  state = {
    webcam: true,
    screenShot: null,
    imageSrc: "",
    imageFile: "",
    OCRResult: "",
    saveImage: false,
    is_barcode_scanning: true,
    status: BARCODE_TERM,
    results: []
  }

  db_temp = {
    item: [
      { id: 1, barcode_num: 8801115114154, item_name: '서울우유 1.5L', category: 1 },
      { id: 2, barcode_num: 8801019310720, item_name: '홈런볼 230g', category: 2 }
    ]
  }

  _onDetected = (result) => {
    this.setState({
      ...this.state, 
      is_barcode_scanning: false,
      status: EXPIRATION_TERM,
      results: [result]
    });
  }

  render() {
    return (
      <div>
          <div>
            Status: {this.state.status} 
            is_barcode_scanning: {this.state.is_barcode_scanning ? "true" : "false"}
          </div>
          <ul className="results">
            {this.state.results.map((result, i) => (<Result key={result.codeResult.code + i} result={result} />))}
          </ul>
        <div>{this.state.is_barcode_scanning ? <Scanner onDetected={this._onDetected}/> : null}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddItem);