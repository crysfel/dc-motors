import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

//https://www.w3schools.com/charsets/ref_utf_geometric.asp

class App extends Component {

  componentDidMount() {
    this.socket = io();
  }

  onForwardPress = (event) => {
    event.stopPropagation();
    console.log('on forward');
    this.socket.emit('direction', 'forward');
  }
  
  onBackwardPress = (event) => {
    event.stopPropagation();
    console.log('on backward');
    this.socket.emit('direction', 'backward');
  }

  onRelease = (event) => {
    event.stopPropagation();
    console.log('on stop');
    this.socket.emit('direction', 'stop');
  }

  render() {
    return (
      <div className="App">
        <button className="btn btn-up" onTouchStart={this.onForwardPress} onTouchEnd={this.onRelease} onTouchCancel={this.onRelease}>&#9651;</button>
        <button className="btn btn-down" onTouchStart={this.onBackwardPress} onTouchEnd={this.onRelease} onTouchCancel={this.onRelease}>&#9661;</button>
      </div>
    );
  }
}

export default App;
