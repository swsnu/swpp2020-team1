import React, { Component } from "react";
import axios from 'axios';
import { connect } from 'react-redux';
 
// material-ui components
import parseDate from '../../components/AddItem/DateParser';
import Scanner from '../../components/AddItem/Scanner';
import Result from '../../components/AddItem/Result';
import dataURLtoFile from '../../components/AddItem/URLtoFile';
import moment from 'moment';
import * as actionCreators from '../../store/actions/index';
import { Dialog } from '@material-ui/core'
 
import './AddItem.css';

const BARCODE_TERM = 'SCAN the barcode'
const EXPIRATION_TERM = 'MOVE to expiration date and TOUCH the screen'



class AddItem extends Component {
  containers = ['freezer', 'fridge', 'shelf'];
  
  state = {
    screenShot: null,
    imageSrc: "",
    imageFile: "",
    OCRResult: "",
    saveImage: false,
    isBarcodeScanning: false,
    isResultVisible: false,
    isRetaking: false
  }

  // Used to activate webcam
  setWebcamRef = (webcam) => {
    this.webcam = webcam;
  }

  handleDetect = (imageText) => {
    console.log("imageText_addCard: ", imageText);
    let ymd = parseDate(imageText);
    this.props.onUpdateItemList(this.props.resultList.length - 1, { expiration_date: ymd });
    this.setState((prevState, props) => ({
      OCRResult: ymd
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
    if(!this.state.isRetaking && this.state.isResultVisible) {
      this.setState((prevState, props) => ({
        screenShot: null,
        imageFile: null
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
      isBarcodeScanning: (this.state.isRetaking ? false : true),
      isResultVisible: (this.state.isRetaking ? true : false),
      isRetaking: false
    }))
    this.getExpirationDateFromImage(e, data => this.handleDetect(data));
  }

  _onDetected = async (result) => {
    if(!this.state.isBarcodeScanning) return;
    
    let barcode_num = result.codeResult.code;
    console.log("barcode_num", barcode_num);

    let user_id = 1;
    await axios.get('/back/user/')
      .then(res => user_id = res.data.user_id)
      .catch(e => console.log(e)) 
    console.log(`user_id: ${user_id}`)

    this.setState((prevState, props) => ({isBarcodeScanning: false, isResultVisible: true, 
                                                   isRetaking: false, status: EXPIRATION_TERM }))
    /*
     * Check if <new_item> is in <user>'s Item DB
     * [ Goal ] To check whether item has <user-custom name>
     * key: (user_id, barcode_num)
     */
    let custom_item = null;
    await axios.get(`/back/item/user/${user_id}/`)
      .then(res => 
        {
          //console.log(res)
          custom_item = res.data.filter(item => 
            (item.barcode_id == barcode_num && item.user_id == user_id)
          )
          //console.log(`custom_item count: ${custom_item.length}`)
          if(custom_item.length>0){
            custom_item = custom_item[custom_item.length - 1];
            console.log('custom_item is:', custom_item);
            this.props.onUpdateItemList(this.props.resultList.length - 1, 
              { name: custom_item.name,
                category_id: custom_item.category_id,
                category_name: custom_item.category_name,
                barcode_num: barcode_num })
          }
        }
      )
      .catch(e => {
        console.log("no custom item");
      });
    
     /*
     * Item is new to this user!
     * Check if <new_item> is in Barcode DB
     * [ Goal ] To set item's <default name>
     * key: (barcode_num)
     */

    console.log(custom_item, "custom_item")
    if(custom_item.length == 0){
      axios.get(`/back/barcode/${barcode_num}/`)
        .then(res => {
          console.log(res.data, "name");
          this.props.onUpdateItemList(this.props.resultList.length - 1, 
            { name: res.data.item_name,
              category_id: res.data.category_id,
              category_name: res.data.category_name,
              barcode_num: barcode_num })
        })
        .catch(err => {
          // Item not found in Barcode DB
          this.props.onUpdateItemList(this.props.resultList.length - 1, { barcode_num: barcode_num })
          console.log("no item on barcode list")
        });
    }
  }

  onClickRetakeBarcodeButton = () => {
    this.setState({ isRetaking: true, isResultVisible: false, isBarcodeScanning: true });
    this.props.onUpdateItemList(this.props.resultList.length - 1, 
      { barcode_num: '', 
        category_id: 0,
        category_name: '기타'
      })
  }

  onClickRetakeExpirationDateButton = () => {
    this.setState({ isRetaking: true, isResultVisible: false, isBarcodeScanning: false });
    this.props.onUpdateItemList(this.props.resultList.length - 1, { expiration_date: new Date(Date.now()) });
  }

  onFinishEditItemButton = () => {
    this.setState((prevState, props) => ({
      screenShot: null,
      imageFile: null,
      isResultVisible: false
    }))
    this.props.onAddNewItem();
  }

  onClickMoveToConfirmButton = () => {
    if(this.state.isResultVisible) {
      this.props.onAddNewItem();
    }
    this.props.history.push('/item/confirm');
  }

  componentDidMount = () => {
    const containerDefault = (this.props.location.state ? this.props.location.state.container : this.containers[0])
    this.props.onSetDefaultContainer(containerDefault);
    this.props.onUpdateItemList(0, {container: containerDefault})
  }

  render() {
    return (
      <div className="AddItem" style={{overflowX: "hidden", overflowY: "hidden"}}>
        <Scanner id="Scanner" onDetected={this._onDetected} onCapture={this.handleOCR} barcode={this.state.isBarcodeScanning} ref="Scanner"/> 
        <div className="StatusTerm">{ this.state.isRetaking ? "Retaking" : (this.state.isBarcodeScanning ? BARCODE_TERM : EXPIRATION_TERM) }</div>
        <div className="Footer">
          <div id='onClickMoveToConfirmButton' className="ConfirmButton" onClick={this.onClickMoveToConfirmButton} >Confirm</div>
        </div>
        <Dialog open={this.state.isResultVisible}>
          <Result isAddItem={true} onClickRetakeBarcode={this.onClickRetakeBarcodeButton}
                      onClickRetakeExpirationDate={this.onClickRetakeExpirationDateButton}
                      onClickEditItem={this.onFinishEditItemButton} />
        </Dialog>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    resultList: state.additem.resultList
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onAddNewItem: () => dispatch(actionCreators.addNewItem()),
    onUpdateItemList: (id, item) => dispatch(actionCreators.updateItemList(id, item)),
    onSetDefaultContainer: (container) => dispatch(actionCreators.setDefaultContainer(container))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddItem);