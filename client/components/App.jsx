import React, { Component } from 'react';

class App extends Component {
<<<<<<< HEAD
  render () {
=======
  constructor(props) {
    super(props);
    this.state = {
    //ACTUAL DEFAULT
      username: document.cookie.slice(9),
      gameMode: false,
      results: [],
      stats: {gamesPlayed: 0, correctAnswers: 0},
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
  }

// Wait until server is working to test correct data
  componentDidMount() {
    console.log('MOUNTED');
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

  render() {
>>>>>>> d9c664d4667635ff19690d7cf0906416772dc362
    return (
      <div>
        <p>LOREM IPSUM REACTO, DID THIS SHOW?</p>
      </div>
    )
  }
}

export default App;
