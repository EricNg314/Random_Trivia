console.log("test");

var titleMessage = document.querySelector("#titleMessage");
var startButton = document.querySelector("#start-button");
var resetButton = document.querySelector("#reset-button");
var questionBox = document.querySelector("#question-box");

var gameInitiated = false;
var timeDefault = 5;
var timeRemaining = 0;
var difficulty = {
  easy: { time: 0, answers: 3 },
  medium: { time: 1, answers: 4 },
  hard: { time: 3, answers: 5 },
};
var difficultyMode = "easy";
var questions = {};
var questionNumber = 0;
var score = 0;
var reset = false;
var isActive = false;

startButton.addEventListener("click", function (event) {
  event.preventDefault();

  titleMessage.textContent = "Loading questions, good luck!";
  startButton.classList.add("hidden");
  resetButton.classList.remove("hidden");
  startGame();
});


resetButton.addEventListener("click", function (event) {
  reset = true;
  event.preventDefault();
  if (isActive === false){
    startGame()
  }
});

async function startGame() {
  // clearInterval(timer);
  isActive = true
  questions = await getQuestions();
  questionNumber = 0;
  score = 0;
  timeRemaining = timeDefault;
  // console.log('test2')
  console.log(questions);

  updateTriviaQA(questions, questionNumber);

  // add on click to answers container
  // call clickCheckAnswer
  // call updateScore

  questionNumber++;

  //  set time interval timer of 1second.
  var timerInterval = setInterval(function () {
    console.log("timerInterval: ", timerInterval );
    if (reset === true) {
      reset = false;
      isActive = false;
      clearInterval(timerInterval)
      startGame();
    } else {
      if (timeRemaining > 0) {
        // console.log("entered timeRemaining");
        timeRemaining--;
      } else {
        isActive = false;
        clearInterval(timerInterval);
        endGame();
      }
      updateTime();
    }
  }, 1000);
  

  
}

async function getQuestions() {
  // questionBox.textContent = ""
  // var apiResponse = await fetch(
  //   "https://api.trivia.willfry.co.uk/questions?limit=1"
  // )
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data)
  //     return data;
  //   });
    var apiResponse = [
    {
        "category": "Food and Drink",
        "correctAnswer": "Sesame ",
        "id": 10638,
        "incorrectAnswers": [
            "Sunflower",
            "Chia"
        ],
        "question": "Which seed is the basic ingredient for tahini paste?",
        "type": "Multiple Choice"
    }
  ]
  return apiResponse;
}

// function update time interval
// set time interval

function updateTime() {
  // display new time
  if (timeRemaining < 0) {
    timeRemaining = 0;
  }
  titleMessage.textContent = "Time Remaining: " + timeRemaining;
}

function updateTriviaQA(questions, questionNumber) {
  questionBox.textContent = questions[questionNumber].question;
  var incorrectAnswers = questions[questionNumber].incorrectAnswers;
  var correctAnswer = questions[questionNumber].correctAnswer;
  var answerAdded = false;
  var outputChoices = [];

  var numbOfOptions = difficulty[difficultyMode].answers;

  // Restricting # of available incorrect options based on difficulty.
  if (incorrectAnswers.length >= numbOfOptions) {
    // subtracting 1 from list to make room for correct answer.
    incorrectAnswers.splice(numbOfOptions - 1, incorrectAnswers.length);
  }

  // Adding +1 for last option position.
  var insertAnswerLoc = getRandomInt(0, incorrectAnswers.length + 1);

  console.log("correctAnswer: ", correctAnswer);
  console.log("incorrectAnswers: ", incorrectAnswers);

  for (var i = 0; i < incorrectAnswers.length; i++) {
    if (i === insertAnswerLoc && answerAdded !== true) {
      outputChoices.push(correctAnswer);
      answerAdded = true;
      i--;
    } else {
      outputChoices.push(incorrectAnswers[i]);
    }
  }
  // Adding to last.
  if (answerAdded !== true){
    outputChoices.push(correctAnswer)
    answerAdded = true;
  }


}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function clickCheckAnswer() {
  var answer = false;
  if (answer === true) {
  } else {
    timeRemaining = timeRemaining - difficulty[difficultyMode].time;
    updateTime();
  }
  return answer;
}

// function updateScore

function endGame() {
  console.log("game ended");
  // show saveScore button
  // add on click call clickSaveScore button.
  // show restartButton
  // add on click call clickRestartButton
}

// function clickSaveScore
// save to localstorage.
// display score.

// function clickRestartButton
// if call startGame, reset game/scores.
