console.log('test')

var questions = {}

var titleMessage = document.querySelector("#titleMessage");
var startButton = document.querySelector("#start-button");
var questionBox = document.querySelector('#question-box');

startButton.addEventListener("click", function(event){
  event.preventDefault();

  titleMessage.textContent = "Good luck!"
  clickStartButton()
})

function clickStartButton() {
  startButton.textContent = "Reset"
  clickStartGame();
}

function clickStartGame () {
  // call getQuestions 
  // set time interval timer of 1second.
    // increment time
    // call updateTime interval
    // call updateQuestion

    // call addAnswerOptions
      // add on click to answers container
      // call clickCheckAnswer
      // call updateScore

    // check time if 0 .
      // call endGame.

    // clear time interval
}

// function getQuestions
  // questionBox.textContent = ""


// function update time interval
// set time interval

// function updateTime
 // display new time

// function updateQuestion

// function addAnswerOptions
 

// function clickCheckAnswer
 // return true/false for answer

// function updateScore


// function endGame
 // show saveScore button
  // add on click call clickSaveScore button.
 // show restartButton
  // add on click call clickRestartButton


// function clickRestartButton
 // if call startGame, reset game/scores.

