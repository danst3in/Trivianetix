import React, { Component } from "react";
import UserInfo from "./UserInfo.jsx";
import Stats from "./Stats.jsx";
import GameContainer from "./GameContainer.jsx";
import LeaderBar from "./LeaderBar.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    //ACTUAL DEFAULT
      username: document.cookie.slice(9),
      gameMode: false,
      results: [],
      stats: {gamesPlayed: 0, correctAnswers: 0},
      leaderboard: {},
      correctResponses: [],
      incorrectResponses: [],
      question:{},
      choice:'none'

      //MOCK DATA
      // username: document.cookie.slice(9),
      // gameMode: false,
      // results: [
      //   {
      //     category: "General Knowledge",
      //     type: "multiple",
      //     difficulty: "easy",
      //     question: "Which one of these Swedish companies was founded in 1943?",
      //     correct_answer: "IKEA",
      //     incorrect_answers: ["H &; M", "Lindex", "Clas Ohlson"]
      //   },
      //   {
      //     category: "General Knowledge",
      //     type: "multiple",
      //     difficulty: "easy",
      //     question: "Which one of these Swedish companies was founded in 1943?",
      //     correct_answer: "IKEA",
      //     incorrect_answers: ["H &; M", "Lindex", "Clas Ohlson"]
      //   }
      // ],
      // stats: { gamesPlayed: 5, correctAnswers: 12 },
      // correctResponses: [],
      // incorrectResponses: [],
      // question:{},
      // choice: 'none',
    };

    // Function binds=================================================
    this.startGame = this.startGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.leaderboardFetch = this.leaderboardFetch.bind(this);
  }

// Wait until server is working to test correct data
  componentDidMount() {
    console.log('MOUNTED');
    this.leaderboardFetch();
    fetch(`/trivia/${this.state.username}`)
    .then(res => res.json())
    .then(data => {
      const { username, results, gamesPlayed, correctAnswers} = data;
      this.setState({
        username,
        results,
        stats: { gamesPlayed, correctAnswers },
      })
    })
    .catch((err) => { console.log(err); })
  }

  startGame() {
    if (!this.state.gameMode){
      fetch(`/trivia/${this.state.username}`)
      .then(res => res.json())
      .then(data => {
        const { results, gamesPlayed, correctAnswers} = data;
        const gameMode = true;
        const question = results.pop();
        this.setState({
          gameMode,
          results,
          question,
          stats: { gamesPlayed, correctAnswers },
        })
      })
      .catch(err => { console.log(err); })
    } else {
      let gameMode = this.state.gameMode;
      let results = [...this.state.results];
      let question = this.state.question;

      // populate question
      if (results.length > 0) {
        question = results.pop();
        gameMode = true;
      }
      // Updating state
      this.setState({
        gameMode,
        results,
        question,
        choice: 'pending',
      })
    }
  }

  handleChange(e) {
    let gameMode = this.state.gameMode;
    const choice = e.target.value;
    const correct = this.state.question.correct_answer;
    const correctResponses = [...this.state.correctResponses];
    const incorrectResponses = [...this.state.incorrectResponses];
    console.log('button value', e.target.value);
    console.log('correct', correct);
    if (choice === correct) {
      correctResponses.push(this.state.question)
    } else {
      incorrectResponses.push(this.state.question);
    }
    if (this.state.results.length > 0) {
      this.startGame();
    } else {
      this.sendResponse();
      gameMode = false;
    }
    e.target.checked = false;
    this.setState({
      gameMode,
      correctResponses,
      incorrectResponses,
    })
  }

  sendResponse() {
    console.log('Sending Repsonse...');
    fetch('/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        correctAnswers: this.state.correctResponses.length,
      }),
    }).then(res => res.json())
    .then(data => {
      const { gamesPlayed, correctAnswers } = data;
      this.setState({
        stats: {gamesPlayed, correctAnswers},
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  leaderboardFetch() {
    const data = [
      {
        "country": "AD",
        "hot dog": 98,
        "hot dogColor": "hsl(80, 70%, 50%)",
        "burger": 146,
        "burgerColor": "hsl(298, 70%, 50%)",
        "sandwich": 78,
        "sandwichColor": "hsl(135, 70%, 50%)",
        "kebab": 180,
        "kebabColor": "hsl(84, 70%, 50%)",
        "fries": 81,
        "friesColor": "hsl(342, 70%, 50%)",
        "donut": 125,
        "donutColor": "hsl(60, 70%, 50%)"
      },
      {
        "country": "AE",
        "hot dog": 28,
        "hot dogColor": "hsl(234, 70%, 50%)",
        "burger": 38,
        "burgerColor": "hsl(325, 70%, 50%)",
        "sandwich": 98,
        "sandwichColor": "hsl(15, 70%, 50%)",
        "kebab": 148,
        "kebabColor": "hsl(80, 70%, 50%)",
        "fries": 49,
        "friesColor": "hsl(197, 70%, 50%)",
        "donut": 118,
        "donutColor": "hsl(344, 70%, 50%)"
      },
      {
        "country": "AF",
        "hot dog": 146,
        "hot dogColor": "hsl(185, 70%, 50%)",
        "burger": 75,
        "burgerColor": "hsl(169, 70%, 50%)",
        "sandwich": 132,
        "sandwichColor": "hsl(325, 70%, 50%)",
        "kebab": 74,
        "kebabColor": "hsl(191, 70%, 50%)",
        "fries": 66,
        "friesColor": "hsl(152, 70%, 50%)",
        "donut": 86,
        "donutColor": "hsl(197, 70%, 50%)"
      },
      {
        "country": "AG",
        "hot dog": 37,
        "hot dogColor": "hsl(88, 70%, 50%)",
        "burger": 163,
        "burgerColor": "hsl(322, 70%, 50%)",
        "sandwich": 167,
        "sandwichColor": "hsl(181, 70%, 50%)",
        "kebab": 94,
        "kebabColor": "hsl(297, 70%, 50%)",
        "fries": 68,
        "friesColor": "hsl(85, 70%, 50%)",
        "donut": 126,
        "donutColor": "hsl(294, 70%, 50%)"
      },
      {
        "country": "AI",
        "hot dog": 156,
        "hot dogColor": "hsl(9, 70%, 50%)",
        "burger": 200,
        "burgerColor": "hsl(152, 70%, 50%)",
        "sandwich": 156,
        "sandwichColor": "hsl(147, 70%, 50%)",
        "kebab": 33,
        "kebabColor": "hsl(303, 70%, 50%)",
        "fries": 66,
        "friesColor": "hsl(299, 70%, 50%)",
        "donut": 95,
        "donutColor": "hsl(225, 70%, 50%)"
      },
      {
        "country": "AL",
        "hot dog": 86,
        "hot dogColor": "hsl(107, 70%, 50%)",
        "burger": 189,
        "burgerColor": "hsl(172, 70%, 50%)",
        "sandwich": 25,
        "sandwichColor": "hsl(239, 70%, 50%)",
        "kebab": 156,
        "kebabColor": "hsl(342, 70%, 50%)",
        "fries": 54,
        "friesColor": "hsl(103, 70%, 50%)",
        "donut": 102,
        "donutColor": "hsl(99, 70%, 50%)"
      },
      {
        "country": "AM",
        "hot dog": 101,
        "hot dogColor": "hsl(211, 70%, 50%)",
        "burger": 48,
        "burgerColor": "hsl(149, 70%, 50%)",
        "sandwich": 138,
        "sandwichColor": "hsl(236, 70%, 50%)",
        "kebab": 42,
        "kebabColor": "hsl(218, 70%, 50%)",
        "fries": 110,
        "friesColor": "hsl(27, 70%, 50%)",
        "donut": 103,
        "donutColor": "hsl(82, 70%, 50%)"
      }
    ]
    this.setState({
      ...this.state,
      leaderboard: data
    })
  }

  render() {
    const leaderStyle = {
      height: "600px"
    }
    return (
      <div className="app">
        {/* ===================================================================================== */}
        {/* When User is logged in, and gameMode=false, render UserInfo, Stats, and GameContainer */}
        {/* ===================================================================================== */}
        <div id="LeaderBar-chart">
        <LeaderBar data={this.state.leaderboard} style={leaderStyle }/>
        </div>
        {!this.state.gameMode ?
          <React.Fragment>
            <UserInfo username={this.state.username} gameMode={this.state.gameMode} />
            <Stats stats={this.state.stats} gameMode={this.state.gameMode} />
            <GameContainer results={this.state.results} gameMode={this.state.gameMode} startGame={this.startGame} />

          </React.Fragment>
          :
        //*================================================================= */}
        //* When User is logged in, and gameMode=true, render GameContainer */}
        //*================================================================= */}
          <React.Fragment>
            <GameContainer
              choice={this.state.choice}
              results={this.state.results}
              gameMode={this.state.gameMode}
              question={this.state.question}
              handleChange={this.handleChange}/>
          </React.Fragment>}
        {/* ================================================================= */}
      </div>
    );
  }
}

export default App;
