import React, { Component } from "react";
import axios from 'axios';

// material-ui components
import parseDate from '../../components/AddItem/DateParser';
import Scanner from '../../components/AddItem/Scanner';
import Result from '../../components/AddItem/Result';
import dataURLtoFile from '../../components/AddItem/URLtoFile';
import moment from 'moment';
import './AddItem.css';

const BARCODE_TERM = 'SCAN the barcode'
const EXPIRATION_TERM = 'MOVE to expiration date and TOUCH the screen'



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
    is_barcode_scanning: false,
    is_result_visible: false,
    is_retaking: false,
    currentResult: this.default_result,
    resultList: []
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
    let file =this.state.imageFile;
    var text = "";
    
    const modelId = 'eeed51f3-682e-450b-95c9-d4f23e6c7792';
    const apiKey = 'cRceuIjMuF9DAvHuC7lTOLnJxnhB0hs1';
    let url = `/api/v2/OCR/Model/${modelId}/LabelFile/`; 

    var data = new FormData();
    data.append('file', file);

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
    var canvas = document.getElementById('canvas');     
    var video = document.getElementById('video');
    canvas.style.display="none";
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);  
    const imageSrc = canvas.toDataURL("image/jpeg");
    const imageFile = await dataURLtoFile(imageSrc,'captured.jpeg');

    this.setState((prevState, props) => ({
      screenShot: imageSrc,
      imageFile: imageFile,
      is_barcode_scanning: (this.state.is_retaking ? false : true),
      is_result_visible: (this.state.is_retaking ? true : false),
      is_retaking: false
    }))
    this.getExpirationDateFromImage(e, data => this.handleDetect(data));
    console.log("After exp date", this.state.currentResult)
  }

  _onDetected = (result) => {
    if(!this.state.is_barcode_scanning) return;
    
    let barcode_num = result.codeResult.code;
    let user_id = 1;
    let item_name = (this.state.is_retaking ? "" : this.state.currentResult.name);
    let category_id = (this.state.is_retaking ? "" : this.state.currentResult.category_id);
    let category_name = (this.state.is_retaking ? "" : this.state.currentResult.category_name);
    let expiration_date = this.state.currentResult.expiration_date;
    let count = this.state.currentResult.count;

    this.setState((prevState, props) => ({is_barcode_scanning: false, is_result_visible: true, is_retaking: false, 
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
    this.setState({ is_retaking: true, is_result_visible: false, is_barcode_scanning: true });
  }

  onClickRetakeExpirationDateButton = () => {
    this.setState({ is_retaking: true, is_result_visible: false, is_barcode_scanning: false, currentResult: { ...this.state.currentResult, expiration_date: '' } });
  }

  onClickManualAddButton = () => {
    if(this.state.is_result_visible) {
      this.setState((prevState, props) => ({
        screenShot: null,
        imageFile: null,
        resultList: [ ...this.state.resultList, this.state.currentResult ],
        currentResult: this.default_result
      }))
    } else {
      this.setState({ is_result_visible: true })
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

  render() {
    if(document.getElementsByClassName("Result").length > 0) {
      if(!this.state.is_result_visible) {
        document.getElementsByClassName("Result")[0].style.top = "-300px";
      } else {
        document.getElementsByClassName("Result")[0].style.top = "-25px";
      }
    }

    return (
      <div className="AddItem" style={{overflowX: "hidden", overflowY: "hidden"}}>
        <Scanner id="Scanner" onDetected={this._onDetected} onCapture={this.handleOCR} barcode={this.state.is_barcode_scanning} ref="Scanner"/> 
        <Result result={this.state.currentResult}
            onClickRetakeBarcode={this.onClickRetakeBarcodeButton}
            onClickRetakeExpirationDate={this.onClickRetakeExpirationDateButton} />
        <div className="StatusTerm">{ this.state.is_retaking ? "Retaking" : (this.state.is_barcode_scanning ? BARCODE_TERM : EXPIRATION_TERM) }</div>
        <div className="Footer">
          <div id="AddManuallyButton" className="ManualAddButton" onClick={this.onClickManualAddButton} >+</div>
          {(this.state.currentResult != null) ? 
            <div id='onClickMoveToConfirmButton' className="ConfirmButton" onClick={this.onClickMoveToConfirmButton} >Confirm</div> : null}
        </div>
      </div>
    );
  }
}

export default AddItem;