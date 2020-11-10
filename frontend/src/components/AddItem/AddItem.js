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
  return year+"/"+month+"/"+date
}

class AddItem extends Component {
  state = {
    webcam: true,
    screenShot: null,
    imageSrc: "",
    imageFile: "",
    OCRResult: "",
    saveImage: false,
    is_editing: false,
    is_barcode_scanning: false,
    is_confirmed: true,
    is_retaking: false,
    result: null,
    results: []
  }

  // TEMPORARY
  db_temp = {
    Barcodes: [
      { id: 1, barcode_num: 8801115114154, item_name: '서울우유 1.5L', category: 1 },
      { id: 2, barcode_num: 8801019310720, item_name: '홈런볼 230g', category: 2 },
      { id: 3, barcode_num: 8801155721527, item_name: '더 진한 딸기우유 500mL', category: 1 }
    ],
    Categories: [
      { id: 3, name: '우유'},
      { id: 4, name: '과자'}
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
      OCRResult: ymd,
      result: { ...this.state.result, expiration_date: ymd } 
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
    
    const modelId = '04e7198a-8507-4543-a1a1-18d9f35c3fd1';
    const apiKey = 'RnrIBDQiOkkHu5EkaeZ3EAQtQMcJmSOv';
    let url = `/api/v2/OCR/Model/${modelId}/LabelFile/`; 

    var data = new FormData();
    data.append('file', file); // file object

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          console.log(this.responseText);
          var jsonResponse = JSON.parse(this.responseText);
          if(jsonResponse["result"][0].prediction[0]){
            text = jsonResponse["result"][0].prediction[0].ocr_text; 
            callback(text)
          }
        }
      }
    });

    xhr.open("POST", url);
    xhr.setRequestHeader("authorization", "Basic " + btoa(`${apiKey}:`));
    xhr.send(data);
  };

  handleOCR = async (e) => {
    if(!this.state.is_retaking && (this.state.result != null) ) {
      this.setState({
        screenShot: null,
        imageFile: null,
        results: [ ...this.state.results, this.state.result ]
      })
      this.setState({
        result: null
      })
    }
    const imageSrc = await this.webcam.getScreenshot();
    const imageFile = await dataURLtoFile(imageSrc,'captured.jpeg');
    this.setState({
      ...this.state,
      screenShot: imageSrc,
      imageFile: imageFile,
      is_barcode_scanning: true,
      is_confirmed: true
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
          if(custom_item.length>0){
            custom_item = custom_item[custom_item.length - 1];
            item_name = custom_item.name; 
            category_id = custom_item.category_id 
            // console.log(`custom name: ${custom_item.name}`);
            this.setState({
              is_barcode_scanning: false,
              is_confirmed: false,
              status: EXPIRATION_TERM,
              result: { ...this.state.result,  
                name: item_name,
                container: "fridge", 
                category_id: category_id,
                category: this.db_temp.Categories.filter(category => (category_id == category.id))[0].name,
                barcode_num: barcode_num,
                expiration_date: null, 
                count: 1 }
              }, () => {
                setTimeout(() => {
                  this.setState({
                    ...this.state
                  });
                }, 1000)}
            )
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
          console.log(res);
          item_name = res.data.item_name;
          category_id = res.data.category_id;
          console.log("CATEGORY")
          console.log(`category_id: ${category_id}`)
          console.log(this.db_temp.Categories.filter(category => (category_id == category.id))[0])
          this.setState({
            is_barcode_scanning: false,
            status: EXPIRATION_TERM,
            is_confirmed: false,
            result: { ...this.state.result,  
              name: item_name,
              container: "fridge", 
              category_id: category_id,
              category: this.db_temp.Categories.filter(category => (category_id == category.id))[0].name,
              barcode_num: barcode_num,
              expiration_date: null, 
              count: 1 }
            });
        })
        .catch(err => {
          // Item not found in Barcode DB
          // console.log(err);
          this.setState({
            is_barcode_scanning: false,
            status: EXPIRATION_TERM,
            is_confirmed: false,
            result: { ...this.state.result,  
              name: item_name, 
              container: "fridge", 
              category_id: category_id, 
              category: "",
              barcode_num: barcode_num, 
              expiration_date: null, 
              count: 1 }
            });
        });
    }
  }

  onClickRetakeBarcodeButton = () => {
    this.setState({ ...this.state, is_retaking: true, is_barcode_scanning: true });
  }

  onClickRetakeExpirationDateButton = () => {
    this.setState({ ...this.state, is_retaking: true, is_barcode_scanning: false });
  }

  onClickEditButton = () => {
    this.setState({ ...this.state, is_editing: true });
  }

  onClickMoveToConfirmButton = () => {
    //console.log("prev result" , this.state.result)
    //console.log("prev results", this.state.results)
    let updatedResults = this.state.results;
    let result = this.state.result;
    updatedResults = updatedResults.concat(result);
    //console.log("updated", updatedResults);
    Promise.resolve()
    .then(() => {
      this.setState({results: updatedResults })
    })
    .then(() => {
      //console.log("after result", this.state.result)
      console.log("after results", this.state.results)
      this.props.history.push('/item/confirm', {items: this.state.results});
    })
  }

  onClickMinusButton = () => {
    if(this.state.result != null && this.state.result.count > 1) {
      let updated_num = this.state.result.count - 1
      this.setState({ ...this.state, result: { ...this.state.result, count: updated_num }})
    }
  }

  onClickPlusButton = () => {
    let updated_num = this.state.result.count + 1
    this.setState({ ...this.state, result: { ...this.state.result, count: updated_num }})
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
          <div>{ this.state.is_retaking ? "(Retaking)" : (this.state.is_barcode_scanning ? BARCODE_TERM : EXPIRATION_TERM) }</div>
          <ul className="results">
            {!this.state.is_confirmed ? <Result result={this.state.result}
                onClickMinusButton={this.onClickMinusButton}
                onClickPlusButton={this.onClickPlusButton}
                onClickRetakeBarcodeButton={this.onClickRetakeBarcodeButton}
                onClickRetakeExpirationDateButton={this.onClickRetakeExpirationDateButton} 
                onClickEditButton={this.onClickEditButton} /> : null }
          </ul>
        <div>{this.state.is_barcode_scanning ? 
              <Scanner onDetected={this._onDetected}/> : 
              <Webcam
              audio={false}
              height={350}
              ref={this.setRef}
              screenshotFormat="image/jpeg"
              width={350}
              videoConstraints={videoConstraints}
              />
              }
        </div>
        
        </Grid>
        <Grid item xs={12}><button onClick={this.handleOCR}>Capture photo</button></Grid>
        
        {/*<Grid item xs={12}>
          {this.state.screenShot 
          ? 
          <div>
            <p><img src={this.state.screenShot} alt="imageForOcr"/> </p>
            <span><button onClick={this.onClickRetake}>Retake?</button></span>
          </div>
          :
          null}
          </Grid>*/}
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
        <div>
          {(this.state.result != null) ? 
            <button onClick={this.onClickMoveToConfirmButton}>Move to ConfirmItem</button> : 
            null}
        </div> 
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