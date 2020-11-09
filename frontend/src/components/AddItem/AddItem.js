import React, { Component} from "react";
import { connect } from "react-redux";
import Webcam from 'react-webcam';
import axios from 'axios';

// material-ui components
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import Scanner from './Scanner';
import Result from './Result';

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), 
    n = bstr.length, 
    u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

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

  turnOff = () => {
    this.setState({
      webcam: false
    })
  }

  // Used to activate webcam
  setRef = (webcam) => {
    this.webcam = webcam;
  }

  // Used to capture webcam image
  // capture = () => {
  //   // returns an encoded base64 string
  //   const imageSrc = this.webcam.getScreenshot();
  //   const imageFile = dataURLtoFile(imageSrc,'captured.jpeg');
  //   this.setState({
  //     screenShot: imageSrc,
  //     imageFile: imageFile
  //   });
  //   this.handleOCR()
  // }
  // Used to recapture webcam
  onClickRetake = (e) => {
    e.persist();
    this.setState({
      screenShot: null
    });
  }

  handleDetect(imageText) {
    console.log("imageText_addCard: ", imageText);
    this.setState({ 
      OCRResult: imageText 
    });
  }

  editOCRResult(e) {
    this.setState({ OCRResult: e.target.value });
  }

  OCR(e, callback){
    e.preventDefault();
    // https://app.nanonets.com/api/v2/ObjectDetection/Model/8d757818-7d43-4d65-bcd6-3e5b0e23bcbf/LabelFile/
    let myImage = this.state.screenShot;
    let file =this.state.imageFile;
    var text = "";
    while(!myImage){
      console.log("myimage is null");
    }

    const modelId = '8d757818-7d43-4d65-bcd6-3e5b0e23bcbf';
    const apiKey = 'cRceuIjMuF9DAvHuC7lTOLnJxnhB0hs1';
    let url = `/api/v2/ObjectDetection/Model/${modelId}/LabelFile/`; 

    var data = new FormData();
    data.append('file', file); // file object

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          console.log(this.responseText);
          var jsonResponse = JSON.parse(this.responseText);
          text = jsonResponse["result"][0].prediction[0].ocr_text; 
          callback(text)
        }
      }
    });

    xhr.open("POST", url);
    xhr.setRequestHeader("authorization", "Basic " + btoa(`${apiKey}:`));
    xhr.send(data);
  };

  handleOCR = async (e) => {
    const imageSrc = await this.webcam.getScreenshot();
    const imageFile = await dataURLtoFile(imageSrc,'captured.jpeg');
    this.setState({
      screenShot: imageSrc,
      imageFile: imageFile
    });
    this.OCR(e, data => this.handleDetect(data));
  }

  // checkAPI = () => {
  //   axios.get("/back/ocr/recognize")
  //     .then(res => {
  //       console.log(res)
  //     })
  // }

  _onDetected = (result) => {
    this.setState({
      ...this.state, 
      is_barcode_scanning: false,
      status: EXPIRATION_TERM,
      results: [result]
    });
  }

  render() {
    const videoConstraints = {
      facingMode: 'user',
    }

    return (
      <Grid
      container
      direction="column"
      justify="flex-end"
      alignItems="center"
      >
        <Grid item xs={12}>
          <div>
            Status: {this.state.status} 
            is_barcode_scanning: {this.state.is_barcode_scanning ? "true" : "false"}
          </div>
          <ul className="results">
            {this.state.results.map((result, i) => (<Result key={result.codeResult.code + i} result={result} />))}
          </ul>
        <div>{this.state.is_barcode_scanning ? <Scanner onDetected={this._onDetected}/> : null}</div>
        {!this.state.is_barcode_scanning 
        ?
        <Webcam
        audio={false}
        height={350}
        ref={this.setRef}
        screenshotFormat="image/jpeg"
        width={350}
        videoConstraints={videoConstraints}
        />
        :
        <div></div>
        }
        </Grid>
        <Grid item xs={12}><button onClick={this.handleOCR}>Capture photo</button></Grid> 
        <Grid item xs={12}>
          {this.state.screenShot 
          ? 
          <div>
            <p><img src={this.state.screenShot} alt="imageForOcr"/> </p>
            <span><button onClick={this.onClickRetake}>Retake?</button></span>
          </div>
          :
          null}
        </Grid>
        <Grid item xs={12}><button onClick={this.turnOff}>Turn off webcam</button></Grid> 
        {/*<Grid item xs={12}><button onClick={this.handleOCR}>Use Ocr</button></Grid> */}
        <Grid item xs={12}>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            floatingLabelText="Expiration Date"
            onChange={this.editOCRResult}
            label={this.state.OCRResult}
          />
        </Grid>
      </Grid>
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