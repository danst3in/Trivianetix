import React, { Component } from 'react';
import Draggable from 'react-draggable';

class GameContainer extends Component {


  render() {
    let gameMode = this.props.gameMode;
    let leadMode = this.props.leadMode;
    let startGame = this.props.startGame;
    let leaderboardShow = this.props.leaderboardShow;
    let question = this.props.question;
    let correctAnswer;
    let incorrectAnswers;
    let answers;
    if (question) {
      correctAnswer = question.correct_answer;
      incorrectAnswers = question.incorrect_answers;
      answers = [correctAnswer, ...incorrectAnswers];
      answers.forEach((el, i) => {
        const random = Math.floor(Math.random() * 4);
        [answers[i], answers[random]] = [answers[random], answers[i]]
      })
    }


   


    return (
      <div className="app">
        {/* ===================================================================================== */}
        {/* When User is logged in, and gameMode=false, render UserInfo, Stats, and GameContainer */}
        {/* ===================================================================================== */}
        {!gameMode ?
          <React.Fragment>
            <div className='gameCard' onClick={() => startGame()}>Play Game</div>
            <div className='gameCard' onClick={() => leaderboardShow()}>Leaderboard</div>

          </React.Fragment>
          :
          //*================================================================= */}
          //* When User is logged in, and gameMode=true, render GameContainer */}
          //*================================================================= */}
          <React.Fragment>

            <div className="header">
              <a href="#default" className="logo">TriviaNetix</a>
              <div className="header-right">
                <a className="active" href="/">Home</a>
                <a href="#user">Profile</a>
                <a href="/leaderboard">Leaderboard</a>
              </div>
            </div>

            <Draggable >
              <div className="chatCard"> 
              <h2>CHAT BOX</h2>  
                <br/>
                <p id='messages' align='left'>User 1: hi </p>
                <p id='messages'>User 2: whaddup </p>
                <p id='messages'>User 1: I'm going to beat you 😃 </p>
                <p id='messages'>User 2: whatever! </p>

                <input placeholder='Submit'></input>
                {/* <button className='card' >Submit</button> */}
              </div>
            </Draggable>
            
            <div className='question-app'>
              <Draggable><div className='question-tag' dangerouslySetInnerHTML={{ __html: question.question }}></div></Draggable>

              <form className='radio-form'>
                <div className="row">
                  <div className="column">
                    <Draggable>
                    <div className="card" id='buttona'>
                      <input  type='radio' name='questions' id='A' onChange={this.props.handleChange} value={answers[0]} />
                      <label id='buttona' className='a' htmlFor='A' dangerouslySetInnerHTML={{ __html: answers[0] }}></label>
                    </div>
                    </Draggable>

                    <Draggable>
                    <div className="card" id='buttonb'>
                      <input  type='radio' name='questions' id='B' onChange={this.props.handleChange} value={answers[1]} />
                      <label id='buttonb' className='b' htmlFor='B' dangerouslySetInnerHTML={{ __html: answers[1] }}></label>
                    </div>
                    </Draggable>
                  </div>
                  <div className="row">
                    <div className="column">
                    <Draggable>
                      <div className="card" id='buttonc'>
                        <input  type='radio' name='questions' id='C' onChange={this.props.handleChange} value={answers[2]} />
                        <label id='buttonc' className='c' htmlFor='C' dangerouslySetInnerHTML={{ __html: answers[2] }}></label>
                      </div>
                      </Draggable>

                      <Draggable>
                      <div className="card" id='buttond'>
                        <input  type='radio' name='questions' id='D' onChange={this.props.handleChange} value={answers[3]} />
                        <label id='buttond' className='d' htmlFor='D' dangerouslySetInnerHTML={{ __html: answers[3] }}></label>
                      </div>
                      </Draggable>
                    </div>
                  </div>
                </div>







              </form>
            </div>
          </React.Fragment>}
        {/* ================================================================= */}
      </div>
    )
  }
}

export default GameContainer;


//document.getElementById('messages')