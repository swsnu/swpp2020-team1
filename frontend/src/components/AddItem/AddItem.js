import React, { Component} from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Webcam from 'react-webcam';
import axios from 'axios';

// material-ui components
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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

function parseDate(text) {
// DD-MM-YYYY
  const re1 = /.*(?<date>0?[1-9]|[12][0-9]|3[01]).*[\/\-\.].*(?<month>0?[1-9]|1[012]).*[\/\-\.].*(?<year>\d{4}).*/g;
// YYYY-MM-DD
  const re2 = /.*(?<year>\d{4}).*[\/\-\.].*(?<month>0?[1-9]|1[012]).*[\/\-\.].*(?<date>0?[1-9]|[12][0-9]|3[01]).*/g;
// MM-DD
  const re3 = /.*(?<month>0?[1-9]|1[012]).*[\/\-\.].*(?<date>0?[1-9]|[12][0-9]|3[01]).*/g; 
  const matched1 = text.matchAll(re1);
  const matched2 = text.matchAll(re2);
  const matched3 = text.matchAll(re3);

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
  for(let match of matched3) {
    console.log("match3: "+match);
    year = new Date().getFullYear();
    month = match.groups.month;
    date = match.groups.date;
    console.log("YEAR: "+year);
    console.log("MONTH: "+month);
    console.log("DATE: "+date);
  }
  return `Expiration: ${year}/${month}/${date}`
}

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
    Barcodes: [
      { id: 1, barcode_num: 8801115114154, item_name: '서울우유 1.5L', category: 1 },
      { id: 2, barcode_num: 8801019310720, item_name: '홈런볼 230g', category: 2 },
      { id: 3, barcode_num: 8801155721527, item_name: '더 진한 딸기우유 500mL', category: 1 }
    ],
    Categories: [
      { id: 1, name: '우유'},
      { id: 2, name: '과자'}
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
    
    const modelId = 'a01501fb-cc0d-4b70-ab07-0efe2c513300';
    const apiKey = 'e6gjXrJeR2ixG2qBXGmPI9C7riwlYjxA';
    let url = `/api/v2/OCR/Model/${modelId}/LabelFile/`; 

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

  _onDetected = async (result) => {
    let barcode_num = result.codeResult.code;
    let user_id = 1; // <TEMPORARY> 나중에 map어쩌고props로 user정보가져오셈
    let item_name = "";
    let category_id = "";
    console.log(`barcode_num: ${barcode_num}`)
    /*
     * Check if <new_item> is in <user>'s Item DB
     * [ Goal ] To check whether item has <user-custom name>
     * key: (user_id, barcode_num)
     */
    let custom_item = null;
    axios.get(`/item/user/${user_id}/`)
      .then(res => 
        {
          // console.log(`res.data[1].barcode_id: ${res.data[1].barcode_id}`);
          // console.log(`res.data[1].user_id: ${res.data[1].user_id}`);
          // console.log(`new item's barcode\n${barcode_num}`);
          // console.log(`new item's user_id: ${user_id}`);
          custom_item = res.data.filter(item => 
            (item.barcode_id == barcode_num && item.user_id == user_id)
          )
          // console.log(custom_item);
          // console.log(`custom_item count: ${custom_item.length}`)
          if(custom_item.length){
            custom_item = custom_item[custom_item.length - 1];
            item_name = custom_item.name; 
            category_id = custom_item.category_id 
            // console.log(`custom name: ${custom_item.name}`);
            this.setState({
              ...this.state, 
              is_barcode_scanning: false,
              status: EXPIRATION_TERM,
              results: [ ...this.state.results, { 
                name: item_name,
                container: "fridge", 
                category_id: category_id,
                barcode_num: barcode_num,
                expiration_date: null, 
                count: 0 }]
              });
          }
        }
      )
     /*
     * Item is new to this user!
     * Check if <new_item> is in Barcode DB
     * [ Goal ] To set item's <default name>
     * key: (barcode_num)
     */
    if(custom_item == null){
      axios.get(`/barcode/${barcode_num}/`)
        .then(res => {
          // console.log(res);
          item_name = res.data.item_name;
          category_id = res.data.category;
          this.setState({
            ...this.state, 
            is_barcode_scanning: false,
            status: EXPIRATION_TERM,
            results: [ ...this.state.results, { 
              name: item_name,
              container: "fridge", 
              category_id: category_id,
              barcode_num: barcode_num,
              expiration_date: null, 
              count: 0 }]
            });
        })
        .catch(err => {
          // Item not found in Barcode DB
          // console.log(err);
          this.setState({
            ...this.state, 
            is_barcode_scanning: false,
            status: EXPIRATION_TERM,
            results: [ ...this.state.results, { 
              name: item_name, 
              container: "fridge", 
              category_id: category_id, 
              barcode_num: barcode_num, 
              expiration_date: null, 
              count: 0 }]
            });
        });
    }
  }

  onClickRemoveButton = async () => {
    this.setState({ ...this.state, is_barcode_scanning: true });
    this.state.results.pop();
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
          <div> {this.state.status} </div>
          <ul className="results">
            {this.state.results.map((result, i) => (<Result key={i} result={result} onClickRemoveButton={this.onClickRemoveButton}/>))}
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