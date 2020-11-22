import React, { Component} from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Webcam from 'react-webcam';
import axios from 'axios';

// material-ui components
import { Typography, Button, TextField, Grid, Dialog } from '@material-ui/core';
import parseDate from '../../components/AddItem/DateParser';
import Scanner from '../../components/AddItem/Scanner';
import Result from '../../components/AddItem/Result';
import dataURLtoFile from '../../components/AddItem/URLtoFile';
import EditItem from '../../components/AddItem/EditItem';

const BARCODE_TERM = 'Scanning Barcode...'
const EXPIRATION_TERM = 'Scanning Expiration Date...'

class AddItem extends Component {
  containers = ['freezer', 'fridge', 'shelf'];

  default_result= {
    name: '',
    category_id: '',
    category_name: '',
    barcode_num: '',
    expiration_date: '', 
    count: 1
  }
  
  state = {
    webcam: true,
    screenShot: null,
    imageSrc: "",
    imageFile: "",
    OCRResult: "",
    saveImage: false,
    container_default: (this.props.location.state ? this.props.location.state.container : this.containers[0]),
    is_editing: false,
    is_barcode_scanning: false,
    is_confirmed: true,
    is_retaking: false,
    currentResult: this.default_result,
    resultList: []
  }

  onClickWebcamOnOff = () => {
    this.setState({
      webcam: !this.state.webcam
    })
  }

  // Used to activate webcam
  setWebcamRef = (webcam) => {
    this.webcam = webcam;
  }

  handleDetect = (imageText) => {
    console.log("imageText_addCard: ", imageText);
    let ymd = parseDate(imageText);
    this.setState((prevState, props) => ({
      OCRResult: ymd,
      currentResult: { ...this.state.currentResult, expiration_date: ymd } 
    }))
  }

  setExpirationDate = (e) => { 
    this.setState({ OCRResult: e.target.value });
  }

  getExpirationDateFromImage = (e, callback) => {
    e.preventDefault();
    // https://app.nanonets.com/api/v2/ObjectDetection/Model/8d757818-7d43-4d65-bcd6-3e5b0e23bcbf/LabelFile/
    let myImage = this.state.screenShot;
    let file =this.state.imageFile;
    var text = "";
    
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
    if(!this.state.is_retaking && (this.state.currentResult !== this.default_result)) {
      this.setState((prevState, props) => ({
        screenShot: null,
        imageFile: null,
        resultList: [ ...this.state.resultList, this.state.currentResult ],
        currentResult: this.default_result
      }))
    }
    const imageSrc = await this.webcam.getScreenshot();
    console.log(imageSrc);
    const imageFile = await dataURLtoFile(imageSrc,'captured.jpeg');
    console.log(imageFile);
    this.setState((prevState, props) => ({
      screenShot: imageSrc,
      imageFile: imageFile,
      is_barcode_scanning: (this.state.is_retaking ? false : true),
      is_confirmed: (this.state.is_retaking ? false : true),
      is_retaking: false
    }))
    console.log('handleOCR clicked updated')
    this.getExpirationDateFromImage(e, data => this.handleDetect(data));
    console.log("After exp date", this.state.currentResult)
  }

  _onDetected = (result) => {
    if(!this.state.is_barcode_scanning) return;
    
    let barcode_num = result.codeResult.code;
    let user_id = 1; // <TEMPORARY> 나중에 map어쩌고props로 user정보가져오셈
    let item_name = (this.state.is_retaking ? "" : this.state.currentResult.name);
    let category_id = (this.state.is_retaking ? "" : this.state.currentResult.category_id);
    let category_name = (this.state.is_retaking ? "" : this.state.currentResult.category_name);
    let expiration_date = this.state.currentResult.expiration_date;
    let count = this.state.currentResult.count;

    this.setState((prevState, props) => ({is_barcode_scanning: false, is_confirmed: false, is_retaking: false, 
      status: EXPIRATION_TERM, currentResult: { ...this.state.currentResult, container: this.state.container_default}}))
    console.log(`barcode_num: ${barcode_num}`)
    /*
     * Check if <new_item> is in <user>'s Item DB
     * [ Goal ] To check whether item has <user-custom name>
     * key: (user_id, barcode_num)
     */
    let custom_item = null;
    axios.get(`/back/item/user/${user_id}/`)
      .then(res => 
        {
          // console.log(`res.data[1].barcode_id: ${res.data[1].barcode_id}`);
          // console.log(`res.data[1].user_id: ${res.data[1].user_id}`);
          // console.log(`new item's barcode\n${barcode_num}`);
          // console.log(`new item's user_id: ${user_id}`);
          console.log(res)
          custom_item = res.data.filter(item => 
            (item.barcode_id == barcode_num && item.user_id == user_id)
          )
          // console.log(`custom_item count: ${custom_item.length}`)
          if(custom_item.length>0){
            custom_item = custom_item[custom_item.length - 1];
            console.log('custom_item is:', custom_item)
            item_name = custom_item.name; 
            category_id = custom_item.category_id 
            // console.log(`custom name: ${custom_item.name}`);
            this.setState({
              currentResult: { ...this.state.currentResult,  
                name: item_name,
                category_id: category_id,
                category_name: category_name,
                barcode_num: barcode_num,
                expiration_date: expiration_date, 
                count: count }
              }
            )
          }
        }
      )
      .catch(e => {});
    
    console.log('at here:', custom_item)
     /*
     * Item is new to this user!
     * Check if <new_item> is in Barcode DB
     * [ Goal ] To set item's <default name>
     * key: (barcode_num)
     */
    if(custom_item == null){
      axios.get(`/back/barcode/${barcode_num}/`)
        .then(res => {
          console.log(res.data.item_name, "item_name");
          item_name = res.data.item_name;
          category_id = res.data.category_id;
          category_name = res.data.category_name;
          this.setState((prevState, props) => ({
            currentResult: { ...this.state.currentResult,  
              name: item_name,
              category_id: category_id,
              category_name: category_name,
              barcode_num: barcode_num,
              expiration_date: expiration_date, 
              count: count }
            }))
        })
        .catch(err => {
          // Item not found in Barcode DB
          // console.log(err);
          this.setState((prevState, props) => ({
            currentResult: { ...this.state.currentResult,  
              name: item_name, 
              category_id: category_id, 
              category_name: category_name,
              barcode_num: barcode_num, 
              expiration_date: expiration_date, 
              count: count }
            }));
        });
    }

    console.log(this.state)
  }

  onClickRetakeBarcodeButton = () => {
    this.setState({ is_retaking: true, is_confirmed: true, is_barcode_scanning: true });
  }

  onClickRetakeExpirationDateButton = () => {
    this.setState({ is_retaking: true, is_confirmed: true, is_barcode_scanning: false, currentResult: { ...this.state.currentResult, expiration_date: '' } });
  }

  onClickEditButton = () => {
    this.setState({ is_editing: true });
  }

  onClickManualAddButton = () => {
    if(!this.state.is_confirmed) {
      this.setState((prevState, props) => ({
        screenShot: null,
        imageFile: null,
        resultList: [ ...this.state.resultList, this.state.currentResult ],
        currentResult: this.default_result,
        is_editing: true
      }))
    } else {
      this.setState({is_editing: true});
    }
  }

  onClickMoveToConfirmButton = () => {
    let updatedResults = this.state.resultList;
    let currentResult = this.state.currentResult;
    updatedResults = updatedResults.concat(currentResult);

    Promise.resolve()
    .then(() => {
      this.setState({resultList: updatedResults })
    })
    .then(() => {
      console.log("after resultList", this.state.resultList)
      this.props.history.push('/item/confirm', {items: this.state.resultList});
    })
  }

  onClickCountMinusButton = () => {
    if(this.state.currentResult != null && this.state.currentResult.count > 1) {
      let updated_num = parseInt(this.state.currentResult.count) - 1
      this.setState({ currentResult: { ...this.state.currentResult, count: updated_num }})
    } else {
      this.setState({ currentResult: { ...this.state.currentResult, count: 1 }})
    }
  }

  onClickCountPlusButton = () => {
    let updated_num = this.state.currentResult.count ? parseInt(this.state.currentResult.count) + 1 : 1;
    this.setState({ ...this.state, currentResult: { ...this.state.currentResult, count: updated_num }})
  }

  //function for EditItem component
  onCancelEditButton = () => {
    this.setState({is_editing: false});
  }

  //function for EditItem component
  onConfirmEditButton = (edit) => {
    let confirm_item = {
      ...this.state.currentResult,
      name: edit.name,
      category_name: edit.category_name,
      barcode_num: edit.barcode_num,
      expiration_date: edit.expiration_date,
      count: edit.count,
      container: edit.container
    }

    this.setState({ is_editing: false, is_barcode_scanning: false, is_confirmed: false, currentResult: confirm_item });
  }

  render() {
    return (
      <React.Fragment>
        <Grid
        container
        direction="column"
        justify="flex-end"
        alignItems="center"
        >
          <Grid item xs={12}>
            <Dialog open={this.state.is_editing}>
              <EditItem result={this.state.currentResult} onCancelEdit={this.onCancelEditButton} onConfirmEdit={this.onConfirmEditButton}></EditItem>
            </Dialog>
            <div>
              <div className="results" style={{backgroundColor: '#EEEEEE'}/*{backgroundColor: '#EEEEEE', position: 'absolute', zIndex: '2'}*/}>
                {!this.state.is_confirmed ? <Result result={this.state.currentResult}
                    onClickCountMinus={this.onClickCountMinusButton}
                    onClickCountPlus={this.onClickCountPlusButton}
                    onClickRetakeBarcode={this.onClickRetakeBarcodeButton}
                    onClickRetakeExpirationDate={this.onClickRetakeExpirationDateButton} 
                    onClickEdit={this.onClickEditButton} /> : null }
              </div>
              <div style={{backgroundColor: '#FFFFFF'}/*{position: 'absolute', zIndex : '1'}*/}>
                <Button id="AddManuallyButton" onClick={this.onClickManualAddButton}>Add Manually</Button>
                <Typography>{ this.state.is_retaking ? "(Retaking)" : (this.state.is_barcode_scanning ? BARCODE_TERM : EXPIRATION_TERM) }</Typography>
                <div>{this.state.webcam ? (this.state.is_barcode_scanning ? 
                      <Scanner id="Scanner" onDetected={this._onDetected} ref="Scanner"/> : 
                      <Webcam
                      audio={false}
                      height={350}
                      ref={this.setWebcamRef}
                      screenshotFormat="image/jpeg"
                      width={350}
                      videoConstraints={{videoConstraintsfacingMode: 'user'}}
                      />) : null
                      }
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}><Button id="handleOCR" onClick={this.handleOCR}>Capture photo</Button></Grid>
          
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
          <Grid item xs={12}><Button id='onClickWebcamOnOffButton' onClick={this.onClickWebcamOnOff}>Webcam On/Off</Button></Grid> 
          {/*<Grid item xs={12}><Button onClick={this.handleOCR}>Use Ocr</Button></Grid> */}
          <Grid item xs={12}>
            <TextField
              multiline
              rows={4}
              id="ExpirationDateTextField"
              variant="outlined"
              onChange={this.setExpirationDate}
              label={this.state.OCRResult}
            />
          </Grid>
          <div>
            {(this.state.currentResult != null) ? 
              <Button id='onClickMoveToConfirmButton' onClick={this.onClickMoveToConfirmButton}>Move to ConfirmItem</Button> : 
              null}
          </div> 
        </Grid>
      </React.Fragment>
    );
  }
}

export default AddItem;