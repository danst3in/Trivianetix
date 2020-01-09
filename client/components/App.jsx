import React, { Component } from 'react';
import UserInfo from './UserInfo.jsx';
import Stats from './Stats.jsx';
import GameContainer from './GameContainer.jsx';
import LeaderBar from './LeaderBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //ACTUAL DEFAULT
      username: document.cookie.slice(9),
      gameMode: false,
      leadMode: false,
      results: [],
      stats: { gamesPlayed: 0, correctAnswers: 0 },
      leaderboard: {},
      correctResponses: [],
      incorrectResponses: [],
      question: {},
      choice: 'none',
      is_correct: null

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
    this.leaderboardShow = this.leaderboardShow.bind(this);
    this.sendStats = this.sendStats.bind(this);
    this.getLeadersByDifficulty = this.getLeadersByDifficulty.bind(this);
    this.getLeadersByCategory = this.getLeadersByCategory.bind(this);
  }

  // Wait until server is working to test correct data
  componentDidMount() {
    console.log('MOUNTED');
    this.leaderboardFetch();
    fetch(`/trivia/${this.state.username}`)
      .then(res => res.json())
      .then(data => {
        const { username, results, gamesPlayed, correctAnswers } = data;
        this.setState({
          username,
          results,
          stats: { gamesPlayed, correctAnswers }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  startGame() {
    if (!this.state.gameMode) {
      fetch(`/trivia/${this.state.username}`)
        .then(res => res.json())
        .then(data => {
          const { results, gamesPlayed, correctAnswers } = data;
          const gameMode = true;
          const leadMode = false;
          const question = results.pop();
          this.setState({
            gameMode,
            leadMode,
            results,
            question,
            stats: { gamesPlayed, correctAnswers }
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      let gameMode = this.state.gameMode;
      let leadMode = this.state.leadMode;
      let results = [...this.state.results];
      let question = this.state.question;

      // populate question
      if (results.length > 0) {
        question = results.pop();
        gameMode = true;
        leadMode = false;
      }
      // Updating state
      this.setState({
        gameMode,
        leadMode,
        results,
        question,
        choice: 'pending'
      });
    }
  }

  leaderboardShow() {
    if (!this.state.leadMode) {
      fetch(`/trivia/${this.state.username}`) // ?????
        .then(res => res.json())
        .then(data => {
          const { results, gamesPlayed, correctAnswers } = data;
          const gameMode = false;
          const leadMode = true;
          // const question = results.pop();
          this.setState({
            gameMode,
            leadMode
            // results,
            // question,
            // stats: { gamesPlayed, correctAnswers },
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
    // else {
    //   let gameMode = this.state.gameMode;
    //   let leadMode = this.state.leadMode;
    // let results = [...this.state.results];
    // let question = this.state.question;

    // populate question
    // if (results.length > 0) {
    //   question = results.pop();
    //   gameMode = true;
    //   leadMode = false;
    // }
    // Updating state
    // this.setState({
    //   gameMode,
    //   leadMode,
    //   results,
    //   question,
    //   choice: 'pending',
    // })
    // }
  }

  handleChange(e) {
    let gameMode = this.state.gameMode;
    let leadMode = this.state.leadMode;
    const choice = e.target.value;
    const correct = this.state.question.correct_answer;
    const correctResponses = [...this.state.correctResponses];
    const incorrectResponses = [...this.state.incorrectResponses];
    console.log('button value', e.target.value);
    console.log('correct', correct);
    if (choice === correct) {
      correctResponses.push(this.state.question);
      this.setState({ is_correct: 'true' });
    } else {
      incorrectResponses.push(this.state.question);
      this.setState({ is_correct: 'false' });
    }
    if (this.state.results.length > 0) {
      this.startGame();
    } else {
      this.sendResponse();
      gameMode = false;
    }
    e.target.checked = false;
    this.setState(
      {
        gameMode,
        correctResponses,
        incorrectResponses,
        choice
      },
      () => this.sendStats()
    );
  }

  sendResponse() {
    console.log('Sending Repsonse...');
    fetch('/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        correctAnswers: this.state.correctResponses.length
      })
    })
      .then(res => res.json())
      .then(data => {
        const { gamesPlayed, correctAnswers } = data;
        this.setState({
          stats: { gamesPlayed, correctAnswers }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  leaderboardFetch() {
    // GOT /response/leaderboard for fetch
    const data = [
      {
        country: 'AD',
        'hot dog': 98,
        'hot dogColor': 'hsl(80, 70%, 50%)',
        burger: 146,
        burgerColor: 'hsl(298, 70%, 50%)',
        sandwich: 78,
        sandwichColor: 'hsl(135, 70%, 50%)',
        kebab: 180,
        kebabColor: 'hsl(84, 70%, 50%)',
        fries: 81,
        friesColor: 'hsl(342, 70%, 50%)',
        donut: 125,
        donutColor: 'hsl(60, 70%, 50%)'
      },
      {
        country: 'AE',
        'hot dog': 28,
        'hot dogColor': 'hsl(234, 70%, 50%)',
        burger: 38,
        burgerColor: 'hsl(325, 70%, 50%)',
        sandwich: 98,
        sandwichColor: 'hsl(15, 70%, 50%)',
        kebab: 148,
        kebabColor: 'hsl(80, 70%, 50%)',
        fries: 49,
        friesColor: 'hsl(197, 70%, 50%)',
        donut: 118,
        donutColor: 'hsl(344, 70%, 50%)'
      },
      {
        country: 'AF',
        'hot dog': 146,
        'hot dogColor': 'hsl(185, 70%, 50%)',
        burger: 75,
        burgerColor: 'hsl(169, 70%, 50%)',
        sandwich: 132,
        sandwichColor: 'hsl(325, 70%, 50%)',
        kebab: 74,
        kebabColor: 'hsl(191, 70%, 50%)',
        fries: 66,
        friesColor: 'hsl(152, 70%, 50%)',
        donut: 86,
        donutColor: 'hsl(197, 70%, 50%)'
      },
      {
        country: 'AG',
        'hot dog': 37,
        'hot dogColor': 'hsl(88, 70%, 50%)',
        burger: 163,
        burgerColor: 'hsl(322, 70%, 50%)',
        sandwich: 167,
        sandwichColor: 'hsl(181, 70%, 50%)',
        kebab: 94,
        kebabColor: 'hsl(297, 70%, 50%)',
        fries: 68,
        friesColor: 'hsl(85, 70%, 50%)',
        donut: 126,
        donutColor: 'hsl(294, 70%, 50%)'
      },
      {
        country: 'AI',
        'hot dog': 156,
        'hot dogColor': 'hsl(9, 70%, 50%)',
        burger: 200,
        burgerColor: 'hsl(152, 70%, 50%)',
        sandwich: 156,
        sandwichColor: 'hsl(147, 70%, 50%)',
        kebab: 33,
        kebabColor: 'hsl(303, 70%, 50%)',
        fries: 66,
        friesColor: 'hsl(299, 70%, 50%)',
        donut: 95,
        donutColor: 'hsl(225, 70%, 50%)'
      },
      {
        country: 'AL',
        'hot dog': 86,
        'hot dogColor': 'hsl(107, 70%, 50%)',
        burger: 189,
        burgerColor: 'hsl(172, 70%, 50%)',
        sandwich: 25,
        sandwichColor: 'hsl(239, 70%, 50%)',
        kebab: 156,
        kebabColor: 'hsl(342, 70%, 50%)',
        fries: 54,
        friesColor: 'hsl(103, 70%, 50%)',
        donut: 102,
        donutColor: 'hsl(99, 70%, 50%)'
      },
      {
        country: 'AM',
        'hot dog': 101,
        'hot dogColor': 'hsl(211, 70%, 50%)',
        burger: 48,
        burgerColor: 'hsl(149, 70%, 50%)',
        sandwich: 138,
        sandwichColor: 'hsl(236, 70%, 50%)',
        kebab: 42,
        kebabColor: 'hsl(218, 70%, 50%)',
        fries: 110,
        friesColor: 'hsl(27, 70%, 50%)',
        donut: 103,
        donutColor: 'hsl(82, 70%, 50%)'
      }
    ];
    this.setState({
      ...this.state,
      leaderboard: data
    });
  }

  //new from backend group
  sendStats() {
    let tempTime = new Date();
    let stringTime = tempTime.toString();
    fetch('/response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        category: this.state.question.category,
        difficulty: this.state.question.difficulty,
        is_correct: this.state.is_correct,
        actual_answer: this.state.question.correct_answer,
        chosen_answer: this.state.choice,
        username: this.state.username,
        question: this.state.question.question,
        current_time: stringTime,
        response_time: '20'
      })
    });
  }

  getLeadersByDifficulty() {
    console.log('getLeaders here');
    fetch('/response/leaderboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        data.forEach(el => {
          const easy = {};
          const medium = {};
          const hard = {};

          if (el.difficulty === 'easy') {
            easy[el.username] = (easy[el.username] || 0) + 1;
          }
          if (el.difficulty === 'medium') {
            medium[el.username] = (medium[el.username] || 0) + 1;
          }
          if (el.difficulty === 'hard') {
            hard[el.username] = (hard[el.username] || 0) + 1;
          }
          return easy, medium, hard;
        });
        const easyLeader = Object.keys(easy).reduce((a, b) =>
          easy[a] > easy[b] ? a : b
        );
        const mediumLeader = Object.keys(easy).reduce((a, b) =>
          medium[a] > medium[b] ? a : b
        );
        const hardLeader = Object.keys(easy).reduce((a, b) =>
          hard[a] > hard[b] ? a : b
        );
        return easyLeader, mediumLeader, hardLeader;
      })
      .catch(err => console.log('error in getLeadersByDifficulty', err));
  }

  getLeadersByCategory() {
    fetch('/response/leaderboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        data.forEach(el => {
          let GeneralKnowlegde = {};
          let EntertainmentBooks = {};
          let EntertainmentFilm = {};
          let EntertainmentMusic = {};
          let EntertainmentMusicals = {};
          let EntertainmentTelevision = {};
          let EntertainmentVideoGames = {};
          let EntertainmentBoardGames = {};
          let ScienceNature = {};
          let ScienceComputers = {};
          let ScienceMathematics = {};
          let Mythology = {};
          let Sports = {};
          let Geography = {};
          let History = {};
          let Politics = {};
          let Art = {};
          let Celebrities = {};
          let Animals = {};
          let Vehicles = {};
          let EntertainmentComics = {};
          let ScienceGadgets = {};
          let EntertainmentAnime = {};
          let EntertainmentCartoon = {};

          if (el.category === 'General Knowlegde') {
            GeneralKnowlegde[el.username] =
              (GeneralKnowlegde[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Books') {
            EntertainmentBooks[el.username] =
              (EntertainmentBooks[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Film') {
            EntertainmentFilm[el.username] =
              (EntertainmentFilm[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Music') {
            EntertainmentMusic[el.username] =
              (EntertainmentMusic[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Musicals & Theatres') {
            EntertainmentMusicals[el.username] =
              (EntertainmentMusicals[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Television') {
            EntertainmentTelevision[el.username] =
              (EntertainmentTelevision[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Video Games') {
            EntertainmentVideoGames[el.username] =
              (EntertainmentVideoGames[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Board Games') {
            EntertainmentBoardGames[el.username] =
              (EntertainmentBoardGames[el.username] || 0) + 1;
          }
          if (el.category === 'Science & Nature') {
            ScienceNature[el.username] = (ScienceNature[el.username] || 0) + 1;
          }
          if (el.category === 'Science: Computers') {
            ScienceComputers[el.username] =
              (ScienceComputers[el.username] || 0) + 1;
          }
          if (el.category === 'Science: Mathematics') {
            ScienceMathematics[el.username] =
              (ScienceMathematics[el.username] || 0) + 1;
          }
          if (el.category === 'Mythology') {
            Mythology[el.username] = (Mythology[el.username] || 0) + 1;
          }
          if (el.category === 'Sports') {
            Sports[el.username] = (Sports[el.username] || 0) + 1;
          }
          if (el.category === 'Geography') {
            Geography[el.username] = (Geography[el.username] || 0) + 1;
          }
          if (el.category === 'History') {
            History[el.username] = (History[el.username] || 0) + 1;
          }
          if (el.category === 'Politics') {
            Politics[el.username] = (Politics[el.username] || 0) + 1;
          }
          if (el.category === 'Art') {
            Art[el.username] = (Art[el.username] || 0) + 1;
          }
          if (el.category === 'Celebrities') {
            Celebrities[el.username] = (Celebrities[el.username] || 0) + 1;
          }
          if (el.category === 'Animals') {
            Animals[el.username] = (Animals[el.username] || 0) + 1;
          }
          if (el.category === 'Vehicles') {
            Vehicles[el.username] = (Vehicles[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Comics') {
            EntertainmentComics[el.username] =
              (EntertainmentComics[el.username] || 0) + 1;
          }
          if (el.category === 'Science: Gadgets') {
            ScienceGadgets[el.username] =
              (ScienceGadgets[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Japanese Anime & Manga') {
            EntertainmentAnime[el.username] =
              (EntertainmentAnime[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Cartoon & Animations') {
            EntertainmentCartoon[el.username] =
              (EntertainmentCartoon[el.username] || 0) + 1;
          }
          return (
            GeneralKnowlegde,
            EntertainmentBooks,
            EntertainmentFilm,
            EntertainmentMusic,
            EntertainmentMusicals,
            EntertainmentTelevision,
            EntertainmentVideoGames,
            EntertainmentBoardGames,
            ScienceNature,
            ScienceComputers,
            ScienceMathematics,
            Mythology,
            Sports,
            Geography,
            History,
            Politics,
            Art,
            Celebrities,
            Animals,
            Vehicles,
            EntertainmentComics,
            ScienceGadgets,
            EntertainmentAnime,
            EntertainmentCartoon
          );
        });
        const GeneralKnowlegdeLeader = Object.keys(
          GeneralKnowlegde
        ).reduce((a, b) => (GeneralKnowlegde[a] > GeneralKnowlegde[b] ? a : b));
        const EntertainmentBooksLeader = Object.keys(
          EntertainmentBooks
        ).reduce((a, b) =>
          EntertainmentBooks[a] > EntertainmentBooks[b] ? a : b
        );
        const EntertainmentFilmLeader = Object.keys(
          EntertainmentFilm
        ).reduce((a, b) =>
          EntertainmentFilm[a] > EntertainmentFilm[b] ? a : b
        );
        const EntertainmentMusicLeader = Object.keys(
          EntertainmentMusic
        ).reduce((a, b) =>
          EntertainmentMusic[a] > EntertainmentMusic[b] ? a : b
        );
        const EntertainmentMusicalsLeader = Object.keys(
          EntertainmentMusicals
        ).reduce((a, b) =>
          EntertainmentMusicals[a] > EntertainmentMusicals[b] ? a : b
        );
        const EntertainmentTelevisionLeader = Object.keys(
          EntertainmentTelevision
        ).reduce((a, b) =>
          EntertainmentTelevision[a] > EntertainmentTelevision[b] ? a : b
        );
        const EntertainmentVideoGamesLeader = Object.keys(
          EntertainmentVideoGames
        ).reduce((a, b) =>
          EntertainmentVideoGames[a] > EntertainmentVideoGames[b] ? a : b
        );
        const EntertainmentBoardGamesLeader = Object.keys(
          EntertainmentBoardGames
        ).reduce((a, b) =>
          EntertainmentBoardGames[a] > EntertainmentBoardGames[b] ? a : b
        );
        const ScienceNatureLeader = Object.keys(ScienceNature).reduce((a, b) =>
          ScienceNature[a] > ScienceNature[b] ? a : b
        );
        const ScienceComputersLeader = Object.keys(
          ScienceComputers
        ).reduce((a, b) => (ScienceComputers[a] > ScienceComputers[b] ? a : b));
        const ScienceMathematicsLeader = Object.keys(
          ScienceMathematics
        ).reduce((a, b) =>
          ScienceMathematics[a] > ScienceMathematics[b] ? a : b
        );
        const MythologyLeader = Object.keys(Mythology).reduce((a, b) =>
          Mythology[a] > Mythology[b] ? a : b
        );
        const SportsLeader = Object.keys(Sports).reduce((a, b) =>
          Sports[a] > Sports[b] ? a : b
        );
        const GeographyLeader = Object.keys(Geography).reduce((a, b) =>
          Geography[a] > Geography[b] ? a : b
        );
        const HistoryLeader = Object.keys(History).reduce((a, b) =>
          History[a] > History[b] ? a : b
        );
        const PoliticsLeader = Object.keys(Politics).reduce((a, b) =>
          Politics[a] > Politics[b] ? a : b
        );
        const ArtLeader = Object.keys(Art).reduce((a, b) =>
          Art[a] > Art[b] ? a : b
        );
        const CelebritiesLeader = Object.keys(Celebrities).reduce((a, b) =>
          Celebrities[a] > Celebrities[b] ? a : b
        );
        const AnimalsLeader = Object.keys(Animals).reduce((a, b) =>
          Animals[a] > Animals[b] ? a : b
        );
        const VehiclesLeader = Object.keys(Vehicles).reduce((a, b) =>
          Vehicles[a] > Vehicles[b] ? a : b
        );
        const EntertainmentComicsLeader = Object.keys(
          EntertainmentComics
        ).reduce((a, b) =>
          EntertainmentComics[a] > EntertainmentComics[b] ? a : b
        );
        const ScienceGadgetsLeader = Object.keys(
          ScienceGadgets
        ).reduce((a, b) => (ScienceGadgets[a] > ScienceGadgets[b] ? a : b));
        const EntertainmentAnimeLeader = Object.keys(
          EntertainmentAnime
        ).reduce((a, b) =>
          EntertainmentAnime[a] > EntertainmentAnime[b] ? a : b
        );
        const EntertainmentCartoonLeader = Object.keys(
          EntertainmentCartoon
        ).reduce((a, b) =>
          EntertainmentCartoon[a] > EntertainmentCartoon[b] ? a : b
        );
        return (
          GeneralKnowlegdeLeader,
          EntertainmentBooksLeader,
          EntertainmentFilmLeader,
          EntertainmentMusicLeader,
          EntertainmentMusicalsLeader,
          EntertainmentTelevisionLeader,
          EntertainmentVideoGamesLeader,
          EntertainmentBoardGamesLeader,
          ScienceNatureLeader,
          ScienceComputersLeader,
          ScienceMathematicsLeader,
          MythologyLeader,
          SportsLeader,
          GeographyLeader,
          HistoryLeader,
          PoliticsLeader,
          ArtLeader,
          CelebritiesLeader,
          AnimalsLeader,
          VehiclesLeader,
          EntertainmentComicsLeader,
          ScienceGadgetsLeader,
          EntertainmentAnimeLeader,
          EntertainmentCartoonLeader
        );
      })
      .catch(err => {
        console.log('error in getLeaders APP.jsx', err);
      });
  }

  render() {
    const leaderStyle = {
      height: '600px'
    };
    return (
      <div className="app">
        {/* ===================================================================================== */}
        {/* When User is logged in, and gameMode=false, leadMode=false, render UserInfo, Stats, and GameContainer */}
        {/* ===================================================================================== */}

        {!this.state.gameMode && !this.state.leadMode ? (
          <React.Fragment>
            <UserInfo
              username={this.state.username}
              gameMode={this.state.gameMode}
              leadMode={this.state.leadMode}
            />
            <Stats stats={this.state.stats} gameMode={this.state.gameMode} />
            <GameContainer
              results={this.state.results}
              gameMode={this.state.gameMode}
              startGame={this.startGame}
              leadMode={this.state.leadMode}
              leaderboardShow={this.leaderboardShow}
            />
          </React.Fragment>
        ) : this.state.gameMode && !this.state.leadMode ? (
          //*================================================================= */}
          //* When User is logged in, and gameMode=true, leadMode=false, render GameContainer */}
          //*================================================================= */}
          <React.Fragment>
            <GameContainer
              choice={this.state.choice}
              results={this.state.results}
              gameMode={this.state.gameMode}
              leadMode={this.state.leadMode}
              question={this.state.question}
              handleChange={this.handleChange}
              leaderboardShow={this.leaderboardShow}
            />
          </React.Fragment>
        ) : (
          //*================================================================= */}
          //* When User is logged in, and leadMode=true, gameMode=false, render LeaderBar */}
          //*================================================================= */}
          <React.Fragment>
            <div id="LeaderBar-chart">
              <LeaderBar
                data={this.state.leaderboard}
                gameMode={this.state.gameMode}
                leadMode={this.state.leadMode}
                leaderboard={this.leaderboardShow}
              />
            </div>
          </React.Fragment>
        )}

        {/* ================================================================= */}
      </div>
    );
  }
}

export default App;
