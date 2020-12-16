import React, { Component } from 'react';
import Quagga from 'quagga';
import dataURLtoFile from './URLtoFile';
import { Button } from '@material-ui/core';
import './Scanner.css';

class Scanner extends Component {
  componentDidMount() {
    Quagga.init({
      inputStream: {
        type : "LiveStream",
        constraints: {
          width: window.innerHeight,
          height: window.innerWidth,
          facingMode: "environment" // or user
        }
      },

      locator: {
        patchSize: "medium",
        halfSample: false,
      },

      numOfWorkers: 2,
      frequency: 4,
      decoder: {
        readers : [
          "ean_reader",
        ]
      },

      debug: {
        drawBoundingBox: true,
        showFrequency: true,
        drawScanline: true,
        showPattern: true
      },
      
      multiple: false,
      // locate: true
      locate: false
    }, function(err) {
      if (err) {
        return console.log(err);
      }
      Quagga.start();
    });

    Quagga.onDetected(this._onDetected);
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected);
    Quagga.stop();
  }

  _onDetected = (result) => {
    //console.log("_onDetected called in scanner");
    //console.log(result)
    // alert("Barcode detected and processed : [" + result.codeResult.code + "]")
    this.props.onDetected(result);
  }


  render() {
    return (
      <div className="Scanner">
        <div id="interactive" className="viewport">
          <video style={{zIndex: '2'}} id="video" className="videoCamera" 
            preload="auto" 
            src="" muted={true} playsInline={true}></video>
          <canvas id="canvas" className="drawingBuffer"></canvas>
        </div>
      </div>
    )
  }
}

export default Scanner;
