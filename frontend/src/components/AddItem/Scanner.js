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
          width: Math.max(parseInt(window.innerWidth/2), 360),
          height: Math.max(parseInt(window.innerHeight/2), 640),
          facingMode: "environment" // or user
        }
      },

      locator: {
        patchSize: "medium",
        halfSample: false
      },

      numOfWorkers: 4,
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
      locate: true
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
    this.props.onDetected(result);
  }


  render() {
    return (
      <div className="ScannerMine">
        <div id="interactive" className="viewport">
          {(!this.props.barcode) ? <div onClick={this.props.onCapture} style={{left: '0px', top: '0px', width: '100%', height: '100%', zIndex: '20', position: 'absolute'}}></div> : null}
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
