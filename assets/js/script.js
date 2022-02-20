console.log('test')

var titleMessage = document.querySelector("#titleMessage");
var startButton = document.querySelector("#start-button");
var questionBox = document.querySelector('#question-box');

var timeDefault = 60;
var timeAmount = 0;
var questions = {}
var questionNumber = 0;
var score = 0;

startButton.addEventListener("click", function(event){
  event.preventDefault();

  titleMessage.textContent = "Good luck!"
  clickStartButton()
})

function clickStartButton() {
  startButton.textContent = "Reset"
  clickStartGame();
}

async function clickStartGame () {
  questions = await getQuestions()
  questionNumber = 0;
  score = 0;
  timeAmount = timeDefault;
  // console.log('test2')
  console.log(questions)
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

async function getQuestions () {
  // questionBox.textContent = ""
  var apiResponse = await fetch('https://api.trivia.willfry.co.uk/questions?limit=20')
  .then(response => response.json())
  .then(data => {
    // console.log(data)
    return data;  
  });

  return apiResponse;  
}


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

// function clickSaveScore
  // save to localstorage.
  // display score.

// function clickRestartButton
 // if call startGame, reset game/scores.

