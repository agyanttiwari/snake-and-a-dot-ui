import React, { Component } from 'react';
import GameClient from '../client/GameClient.js';
import './GameCanvas.css';

class GameCanvas extends Component {

  height = 20;
  width = 20;
  timeLapse = 600;
  latestMoveId = 0;

  gameClient = new GameClient();
  snakePoints = [];
  dotLocation = {};

  constructor(props) {
    super(props);
    this.height = props.height;
    this.width = props.width;
    let gameBoardState = this.initGameBoard();
    this.state = {
      gameBoardState: gameBoardState,
      gameOver: false
    };
    this.startGame();
    this.startTimer();
  }

  resetGame = () => {
    let gameBoardState = this.initGameBoard();
    this.snakePoints = [];
    this.dotLocation = {};
     this.timeLapse = 600;
    this.latestMoveId = 0;
    this.setState({
      gameBoardState: gameBoardState,
      gameOver: false
    }, () => {
      this.startGame();
      this.startTimer();
    });
    this.gameCanvas.focus();
  }

  initGameBoard = () => {
    let stateGrid = [];
    for (let row = 0; row < this.height; row++){
      var rowState = [];
      for (let col = 0; col < this.width; col++){
        rowState.push[false];
      }
      stateGrid.push(rowState);
    }
    return stateGrid;
  }

  startTimer = () => {
    let _this = this;
    _this.latestMoveId += 1;
    let moveId = _this.latestMoveId;
    setTimeout(function () {
        if (moveId === _this.latestMoveId && !_this.state.gameOver) {
            _this.startTimer();
            _this.moveSnake();
        }
    }, this.timeLapse);
  }


  startGame = () => {
    this.gameClient.startGameCall(this.height, this.width).then((response) => {
      this.drawSnake(response);
    }).catch((exception) => {
      console.log('BOOOOO', exception);
    });
  }

  handleKeyPress = (event) => {
    if (event.keyCode === 38) {
        this.startTimer();
        this.moveSnake('up');
    }
    else if (event.keyCode === 40) {
        this.moveSnake('down');
        this.startTimer();
    }
    else if (event.keyCode === 37) {
       this.timerRestarted = true;
       this.moveSnake('left');
    }
    else if (event.keyCode === 39) {
       this.timerRestarted = true;
       this.moveSnake('right');
    }
  }

  moveSnake = (direction) => {
    this.gameClient.move(direction).then((response) => {
      this.drawSnake(response);
    }).catch((exception) => {
      console.log('boo');
    });
  }

  drawSnake = (response) => {
    if (response.gameOver){
      this.setState({gameOver: true});
    } else {
      let pointsToRedraw = [];
      let pointsToRemove = [];
      if (this.dotLocation.x != response.dotLocation.x || this.dotLocation.y != response.dotLocation.x){
        pointsToRemove.push(this.dotLocation);
        this.dotLocation = response.dotLocation;
        pointsToRedraw.push(response.dotLocation);
        this.timeLapse = this.timeLapse > 200 ? this.timeLapse - 10 : 200;
      }
      let oldPoints = JSON.parse(JSON.stringify(this.snakePoints));
      this.snakePoints = response.snakePoints;
      if (this.snakePoints.length === oldPoints.length){
        pointsToRemove.push(oldPoints[0]);
      }
      pointsToRedraw.push(this.snakePoints[this.snakePoints.length - 1]);
      this.redrawCanvas(pointsToRedraw, pointsToRemove);
    }
  }


  getPixel = (posx, posy) => {
    return <div className="gamePixelContainer">
      <div className={"gamePixel " +
      (this.state.gameBoardState[posx][posy] ? "switchedOn"+posx%2 + posy%2 : "") +
      ((posx === this.dotLocation.x && posy === this.dotLocation.y) ? " iAmTheDot" : "")
    } />
    </div>;
  }

  redrawCanvas = (switchOnArray, switchOffArray) => {
    let gameState = this.state.gameBoardState;
    this.setPixelState(gameState, switchOffArray, false);
    this.setPixelState(gameState, switchOnArray, true);
    this.setState({gameBoardState: gameState});
  }

  setPixelState = (gameState ,posArray, stateVal) => {
    posArray.forEach((pos) => {
      gameState[pos.x][pos.y] = stateVal;
    });
  }

  getGameOverScreen = () => {
    return <div className="gameOverContainer">
      <h1 className="gameOverLabel"> Game Over !!! </h1>
      <button className="restartButton" onClick={this.resetGame}>Restart!</button>
    </div>;
  }

  renderCanvas = () => {
    let canvasGrid = [];
    for (let row = 0; row < this.height; row++){
      for (let col = 0; col < this.width; col++){
        canvasGrid.push(this.getPixel(row, col));
      }
      canvasGrid.push(<br />);
    }
    return canvasGrid;
  }
  componentDidMount() {
    this.gameCanvas.focus();
  }
  render() {
    return (
      <div ref={ gameCanvas => this.gameCanvas = gameCanvas} className="gameCanvas" tabIndex="0" onKeyDown={this.handleKeyPress}>
        {(this.state.gameOver ? this.getGameOverScreen() : this.renderCanvas())}
      </div>
    );
  }
}

export default GameCanvas;
