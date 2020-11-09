import React, { Component} from "react";
import { connect } from "react-redux";
import Webcam from 'react-webcam';
import axios from 'axios';

// material-ui components
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';

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

function parseDate(text) {
// DD-MM-YYYY
  const re1 = /(?<date>0?[1-9]|[12][0-9]|3[01])[\/\-\.](?<month>0?[1-9]|1[012])[\/\-\.](?<year>\d{4})/g;
// YYYY-MM-DD
  const re2 = /(?<year>\d{4})[\/\-\.](?<month>0?[1-9]|1[012])[\/\-\.](?<date>0?[1-9]|[12][0-9]|3[01])/g;
  const matched1 = text.matchAll(re1);
  const matched2 = text.matchAll(re2);

  let year, month, date;
  for(let match of matched1) {
    console.log("match1: "+match);
    year = match.groups.year;
    month = match.groups.month;
    date = match.groups.date;
    console.log("YEAR: "+year);
    console.log("MONTH: "+month);
    console.log("DATE: "+date);

  }
  for(let match of matched2) {
    console.log("match2: "+match);
    year = match.groups.year;
    month = match.groups.month;
    date = match.groups.date;
    console.log("YEAR: "+year);
    console.log("MONTH: "+month);
    console.log("DATE: "+date);
  }
  return "Expiration: "+year+"/"+month+"/"+date
}

class AddItem extends Component {
  state = {
    webcam: true,
    screenShot: null,
    imageSrc: "",
    imageFile: "",
    OCRResult: "",
    saveImage: false,
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

  onClickRetake = (e) => {
    e.persist();
    this.setState({
      screenShot: null
    });
  }

handleDetect(imageText) {
  console.log("imageText_addCard: ", imageText);
  let ymd = parseDate(imageText);
  this.setState({
    OCRResult: ymd 
  })
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

render() {
  const videoConstraints = {
    width: 1280,
    height: 720,
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
      {this.state.webcam 
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
      {/* <Grid item xs={12}><button onClick={this.handleOCR}>Use Ocr</button></Grid>  */}
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