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
import { Dialog, List, Typography, Button } from '@material-ui/core';
 
import './AddItem.css';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import HelpSharpIcon from '@material-ui/icons/HelpSharp';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExpireImage from '../../icons/expire.png';
import BarcodeImage from '../../icons/barcode.png';
import ConfirmImage from '../../icons/confirm.png';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';



const BARCODE_TERM = '바코드를 스캔해주세요'
const EXPIRATION_TERM = '유통기한을 촬영해주세요 (예) 2020/12/25'

const styles = {
  newPaper: {
    margin: 0,
    backgroundColor: "rgba(0, 0, 0, 0)"
  },
  helpButton:{
    color: "#7DBF1A",
  },
  xButton:{
    marginTop: 0,
    marginBottom: 0, 
  },
  backButton: {
    color: '#FFFFFF',
  }
}

class AddItem extends Component {
  containers = ['freezer', 'fridge', 'shelf'];
  
  defaultItem = {
    name: '',
    container: 'fridge',
    category_id: 0,
    category_name: '기타',
    barcode_num: '',
    expiration_date: new Date(Date.now()),
    count: 1
  }

  state = {
    screenShot: null,
    imageSrc: "",
    imageFile: "",
    OCRResult: "",
    saveImage: false,
    isBarcodeScanning: false,
    isResultVisible: false,
    isRetaking: false,
    expiration_date_loading: true,
    defaultItem: this.defaultItem,
    currentItem: this.defaultItem,
    help: false,
    helpImage: ExpireImage, 
    tabValue: 0
  }

  // Used to activate webcam
  setWebcamRef = (webcam) => {
    this.webcam = webcam;
  }

  handleDetect = (imageText) => {
    console.log("imageText_addCard: ", imageText);
    let ymd = parseDate(imageText);

    if(ymd === 'error') {
      this.setState({
        OCRResult: ymd, 
        currentItem: { ...this.state.currentItem, expiration_date: new Date(Date.now()) },
        expiration_date_loading: false,
      })
    } else {
      this.setState((prevState, props) => ({
        OCRResult: ymd,
        currentItem: {...this.state.currentItem, expiration_date: ymd},
        expiration_date_loading: false,
      }))
    }
  }

  onClickCardOff = () => {
    this.setState({help: false});
  }

  onClickHelpButton = () => {
    this.setState({help: true})
  }

  setExpirationDate = (e) => { 
    this.setState({ OCRResult: e.target.value });
  }

  getExpirationDateFromImage = (e, success_callback, fail_callback) => {
    e.preventDefault();
    let file =this.state.imageFile;
    var text = "";
    
    const modelId = '2e26250c-8e50-4314-baa6-2e840f045a74';
    const apiKey = 'eeCu_SGIiIeQ1ECh-EzH3SqVWcBwaX5z';
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
            for (let prediction of jsonResponse["result"][0].prediction) {
              text += prediction.ocr_text;
            }
            success_callback(text);
          } else {
            fail_callback();
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
      // ???
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
      isRetaking: false,
      expiration_date_loading: true,
    }))
    this.getExpirationDateFromImage(
      e, 
      data => this.handleDetect(data),
      () => this.setState({expiration_date_loading: false}));
  }

  _onDetected = async (result) => {
    if(!this.state.isBarcodeScanning) return;
    
    let barcode_num = result.codeResult.code;
    console.log("barcode_num", barcode_num);

    let user_id = 1;
    await axios.get('/back/user/')
      .then(res => user_id = res.data.user_id)
      .catch(e => console.log(e)) 

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
            (item.barcode_id === barcode_num && item.user_id === user_id)
          )
          //console.log(`custom_item count: ${custom_item.length}`)
          if(custom_item.length>0){
            custom_item = custom_item[custom_item.length - 1];
            console.log('custom_item is:', custom_item);
            this.setState({
              currentItem: {
                ...this.state.currentItem,
                name: custom_item.name,
                category_id: custom_item.category_id,
                category_name: custom_item.category_name,
                barcode_num: barcode_num
              }
            })
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

    console.log("custom item existence check: ", custom_item)
    if(custom_item.length == 0){
      axios.get(`/back/barcode/${barcode_num}/`)
        .then(res => {
          console.log(res.data, "name");
          this.setState({
            currentItem: {
              ...this.state.currentItem,
              name: res.data.item_name,
              category_id: res.data.category_id,
              category_name: res.data.category_name,
              barcode_num: barcode_num
            }
          })
        })
        .catch(err => {
          // Item not found in Barcode DB
          console.log("currentItemis: ", this.state.currentItem);
          this.setState({
            currentItem: {
              ...this.state.currentItem,
              barcode_num: barcode_num
            }
          })
          console.log("no item on barcode list")
        });
    }
  }

  onClickRetakeBarcodeButton = () => {
    this.setState({ 
      isRetaking: true, 
      isResultVisible: false, 
      isBarcodeScanning: true,
      currentItem: {
        ...this.state.currentItem,
        barcode_num: '', 
        category_id: 0,
        category_name: '기타'  
      }});
  }

  onClickRetakeExpirationDateButton = () => {
    this.setState({ 
      isRetaking: true, 
      isResultVisible: false, 
      isBarcodeScanning: false,
      currentItem: {
        ...this.state.currentItem,
        expiration_date: new Date(Date.now())
      }});
  }

  onClickFinishEditItemButton = () => {
    this.props.onAddNewItem(this.state.currentItem)
    this.setState({
      screenShot: null,
      imageFile: null,
      isResultVisible: false,
      currentItem: this.state.defaultItem
    })
  }

  onChangeEditItemValue = (value) => {
    this.setState({
      currentItem: {
        ...this.state.currentItem,
        ...value
      }
    })
  }

  onClickMoveToConfirmButton = () => {
    if(this.state.isResultVisible) {
      this.props.onAddNewItem();
    }
    this.props.history.push('/item/confirm', {container: this.state.defaultItem.container});
  }

  onClickSkipButton = () => {
    if(this.state.isBarcodeScanning) {
      this.setState({
        isBarcodeScanning: false,
        isResultVisible: true,
        isRetaking: false,
        currentItem: {
          ...this.state.currentItem,
          name: '',
          category_id: 0,
          category_name: '기타',
          barcode_num: ''
        }
      })
    } else {
      this.setState({
        isBarcodeScanning: true,
        isResultVisible: (this.state.isRetaking ? true : false),
        isRetaking: false,
        currentItem: {
          ...this.state.currentItem,
          expiration_date: null
        },
        expiration_date_loading: false,
      })
    }
  }

  componentDidMount = () => {
    const containerDefault = (this.props.location.state ? this.props.location.state.container : this.state.currentItem.container)
    this.setState({
      defaultItem: {
        ...this.state.defaultItem,
        container: containerDefault
      },
      currentItem: {
        ...this.state.currentItem,
        container: containerDefault
      }
    })
  }
  helpExpire = () => {
    this.setState(
     { helpImage : ExpireImage,
       tabValue: 0 }
    )
  }
  helpBarcode = () => {
    this.setState(
     { helpImage : BarcodeImage,
       tabValue: 1 }
    )
  }
  helpList = () => {
    this.setState(
     { helpImage : ConfirmImage,
       tabValue: 2 }
    )
  }

  a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  handleTabValueChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  }

  onClickBackButton = () => {
    this.props.history.push('/')
  }

  render() {
    const {classes} = this.props;
  
    return (
      <div className="AddItem" style={{overflowX: "hidden", overflowY: "hidden"}}>

        <Scanner id="Scanner" onDetected={this._onDetected} ref="Scanner"/>
        
        <div className="backButtonContainer">
          <IconButton className={`${classes.backButton} backButton`} onClick={this.onClickBackButton}><ArrowBackIcon/></IconButton>
        </div>


        <div className="StatusTerm">
          { this.state.isRetaking ? "Retaking" : (this.state.isBarcodeScanning ? BARCODE_TERM : EXPIRATION_TERM) }
        </div>

        <div className="BarcodeLine">
          { this.state.isBarcodeScanning === true ? 
            <hr style={{border: "solid 1px red", width: "350px"}} /> : 
            null }
        </div>
        
        <div className="SkipAndCaptureButton">
          <div id='onClickCaptureButton' className="Button" style={{width: "80px"}} onClick={this.onClickSkipButton} >스킵</div>
          { this.state.isBarcodeScanning === false ? 
            <div id='onClickCaptureButton' className="Button" style={{width: "180px"}} onClick={this.handleOCR} ><PhotoCamera /><span style={{marginLeft: "10px"}}>촬영</span></div> : 
            null }
        </div>
        
        <div className="Footer">
          <IconButton className={`${classes.helpButton}`} onClick={this.onClickHelpButton}><HelpSharpIcon fontSize="large"/></IconButton>
          <div id='onClickMoveToConfirmButton' className="ConfirmButton" onClick={this.onClickMoveToConfirmButton} >목록 보기</div>
          
        </div>
        
        <Dialog open={this.state.isResultVisible} classes={{paper: classes.newPaper}}>
          <Result isAddItem={true} onClickRetakeBarcode={this.onClickRetakeBarcodeButton}
                  onClickRetakeExpirationDate={this.onClickRetakeExpirationDateButton}
                  onClickFinishEditItem={this.onClickFinishEditItemButton}
                  onChangeEditItem={this.onChangeEditItemValue}
                  item={this.state.currentItem}
                  expiration_date_loading={this.state.expiration_date_loading} />
        </Dialog>
        
        <Dialog open={this.state.help} fullWidth>
          <Button className={classes.xButton} onClick={this.onClickCardOff}>X</Button>
          <Tabs
            value={this.state.tabValue}
            indicatorColor="primary"
            textColor="primary"
            centered >
            <Tab label="유통기한 스캔" onClick={this.helpExpire} {...this.a11yProps(0)}/>
            <Tab label="바코드 스캔" onClick={this.helpBarcode} {...this.a11yProps(1)}/>
            <Tab label="목록 보기" onClick={this.helpList} {...this.a11yProps(2)}/>
          </Tabs>
          <div style={{height: "400px", display: "flex", justifyContent: "center"}}>
            <img src={this.state.helpImage} style={{width:"auto", height:"100%"}} /> 
          </div>
        </Dialog>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddNewItem: (item) => dispatch(actionCreators.addNewItem(item))
  }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(AddItem));