import React, { Component } from 'react';
import Quagga from 'quagga';

import './Scanner.css';

class Scanner extends Component {
  componentDidMount() {
    Quagga.init({
      inputStream: {
        type : "LiveStream",
        constraints: {
          width: 350,
          height: 350,
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
      locate: true,
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
  }

  _onDetected = (result) => {
    this.props.onDetected(result);
  }

  render() {
    return (
      <div className="ScannerMine">
        <div id="interactive" className="viewport">
          <video className="videoCamera" 
            preload="auto" 
            src="" muted={true} playsInline={true}></video>
          <canvas className="drawingBuffer"></canvas>
        </div>
      </div>
    )
  }
}

export default Scanner;