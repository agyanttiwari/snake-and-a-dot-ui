import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GameCanvas from './components/GameCanvas';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Snake-and-a-Dot</h1>
        </header>
        <GameCanvas height='20' width='20' />
      </div>
    );
  }
}

export default App;
