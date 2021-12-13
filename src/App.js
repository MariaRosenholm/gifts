import "./App.css";
import React, { Component } from "react";
import Circle from "./components/Circle";
import { circles } from "./components/circles";
import PopUp from "./components/gameOverPopUp";
import gameOver from "./components/assets/sounds/GameOver.mp3";
import background from "./components/assets/sounds/Background.mp3";
import gift from "./components/assets/sounds/gift.mp3";

let gameOverSound = new Audio(gameOver);
let backgroundSound = new Audio(background);
let giftSound = new Audio(gift);

const clickedList = [];
const activeList = [];

const randomizer = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class App extends Component {
  state = {
    score: 0,
    current: 0,
    showPopUp: false,
    showStart: false,
    showStop: true,
    showGift: false,
    pace: 5000,
    rounds: 0,
    message: "",
  };

  timer = undefined;

  clickHandler = (id) => {
    giftSound.play();
    clickedList.push(id);
    let l = clickedList.length;

    if (
      JSON.stringify(activeList[(0, l - 1)]) !==
      JSON.stringify(clickedList[(0, l - 1)])
    ) {
      this.stopHandler();
      return;
    }
    this.setState({
      score: this.state.score + 10,
      rounds: 1,
      showGift: true,
    });
  };

  nextCircle = () => {
    if (this.state.rounds === 5) {
      this.stopHandler();
      return;
    }

    let nextActive;

    do {
      nextActive = randomizer(1, 4);
      activeList.push(nextActive);
    } while (JSON.stringify(activeList) === JSON.stringify(clickedList));

    this.setState({
      current: nextActive,
      pace: this.state.pace * 0.95,
      rounds: this.state.rounds + 1,
      showGift: false,
    });

    this.timer = setTimeout(this.nextCircle, this.state.pace);
  };

  startHandler = () => {
    backgroundSound.play();
    gameOverSound.pause();
    this.nextCircle();
    this.setState({
      showStop: false,
      showStart: true,
    });
  };

  messageHandler = () => {
    if (this.state.score < 10) {
      this.setState({
        message: "You left elves in trouble! No one will get gifts this year!",
      });
    }
    if (this.state.score >= 10) {
      this.setState({
        message: "You are getting hang of this!",
      });
    } else if (this.state.score > 50) {
      this.setState({
        message: "Good job! Keep on going!",
      });
    } else if (this.state.score > 100) {
      this.setState({
        message: "We will keep you here all year round!",
      });
    } else if (this.state.score > 200) {
      this.setState({
        message: "You are pro now. Here is your tonttulakki!",
      });
    }
  };

  stopHandler = () => {
    this.messageHandler();
    backgroundSound.pause();
    gameOverSound.play();
    clearTimeout(this.timer);

    this.setState({
      showPopUp: true,
      current: 0,
    });
  };

  close = () => {
    clickedList.length = 0;
    activeList.length = 0;

    this.setState({
      showPopUp: false,
      showStop: true,
      showStart: false,
      score: 0,
      pace: 5000,
      rounds: 0,
    });
  };

  render() {
    return (
      <div className="App">
        <h1>Toss the gifts to the sleigh</h1>
        <p>Score: {this.state.score} </p>
        <div id="wrapper">
          {circles.map((c) => (
            <Circle
              key={c.id}
              click={() => this.clickHandler(c.id)}
              active={this.state.current === c.id}
              disabled={this.state.showStart}
              hide={this.state.showGift}
            />
          ))}
        </div>
        <button
          className="buttons"
          disabled={this.state.showStart}
          onClick={this.startHandler}
        >
          Start
        </button>
        <button
          className="buttons"
          disabled={this.state.showStop}
          onClick={this.stopHandler}
        >
          Stop
        </button>
        {this.state.showPopUp && (
          <PopUp
            message={this.state.message}
            score={this.state.score}
            close={this.close}
          />
        )}
      </div>
    );
  }
}

export default App;
