console.log("test");

var difficultySelector = document.querySelector("#difficultySelector");
var titleMessage = document.querySelector("#titleMessage");
var timerMessage = document.querySelector("#timerMessage");
var startButton = document.querySelector("#startButton");
var resetButton = document.querySelector("#resetButton");
var questionBox = document.querySelector("#questionBox");
var questionAnswers = document.querySelector("#questionAnswers");
var answerResult = document.querySelector("#answerResult");
var scoreMessage = document.querySelector("#scoreMessage");

var gameInitiated = false;
var timeDefault = 60;
var timeRemaining = 0;
var difficulty = {
  easy: { timeLoss: 0, answers: 3 },
  medium: { timeLoss: 1, answers: 4 },
  hard: { timeLoss: 3, answers: 5 },
};
var difficultyMode = "medium";
var questions = {};
var questionNumber = 0;
var score = 0;
var reset = false;
var isActive = false;

difficultySelector.addEventListener("click", function (event) {
  event.preventDefault();

  var modeEle = event.target

  if(modeEle.matches('button')){
    for(var i=0; i < difficultySelector.childElementCount; i++){
      difficultySelector.children[i].classList.remove("selected");
    }
    difficultyMode = modeEle.getAttribute('data-difficulty')
    modeEle.classList.add("selected")
    console.log("difficultyMode: ", difficultyMode)
  }
});

startButton.addEventListener("click", function (event) {
  event.preventDefault();

  titleMessage.textContent = "Random Trivia - Good luck!";
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


questionAnswers.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("questions: ", questions)
  if(isActive === true){
    clickCheckAnswer(event);
  }
});


async function startGame() {
  isActive = true
  questionNumber = 0;
  questions = await getQuestions();
  score = 0;
  timeRemaining = timeDefault;
  console.log(questions);

  // Avoid update if resetting.
  if (reset !== true) {
    updateTriviaQA(questions, questionNumber);
  }

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
        // Resetting if timer is out.
        isActive = false;
        questions = {};
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
  //   "https://api.trivia.willfry.co.uk/questions?limit=20"
  // )
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data)
  //     window.apiResponseData  = data
  //     return data;
  //   });
    var apiResponse = [
      {
          "category": "Music",
          "correctAnswer": "Megadeath",
          "id": 26770,
          "incorrectAnswers": [
              "Metallica",
              "Slayer"
          ],
          "question": "Who had a UK top twenty hit in 1990 with \"No More Mr Nice Guy\"?",
          "type": "Multiple Choice"
      },
      {
          "category": "Science",
          "correctAnswer": "ants",
          "id": 7480,
          "incorrectAnswers": [
              "fresh water environments, particularly lakes",
              "the Soviet Union",
              "prehistoric metazoans ",
              "the effects of radiation upon living organisms",
              "the nature of Buddha",
              "butterflies and moths",
              "friction at very small scale",
              "the signification and application of words"
          ],
          "question": "What is Myrmecology the study of?",
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
  timerMessage.textContent = "Time Remaining: " + timeRemaining;
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

  // Clear current choices
  questionAnswers.innerHTML = "";

  // Adding answer buttons.
  for (var j=0; j < outputChoices.length; j++){
    var button = document.createElement('button');
    button.classList.add("color-tertiary", "answer-button");
    button.textContent = outputChoices[j]
    questionAnswers.append(button)

  }


}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function clickCheckAnswer(event) {
  var clickedAnswer = event.target.textContent;
  var correctAnswer = questions[questionNumber].correctAnswer;
  var timeLoss = difficulty[difficultyMode].timeLoss

  if (correctAnswer === clickedAnswer) {
    score++;
    scoreMessage.textContent = "Score: " + score;
    answerResult.textContent = "Correct";
  } else {
    timeRemaining = timeRemaining - timeLoss;
    updateTime();
    answerResult.textContent = "Wrong - Time deducted: " + timeLoss + " seconds.";
  }
  answerResult.classList.remove("hidden");

  // Setting message to show right/wrong temporarily.
  var answerMsgTimer = 2;
  var answerMsgInterval = setInterval(function () {
    // If there are no more words left in the message
    if (answerMsgTimer <= 0) {
      // Use `clearInterval()` to stop the timer
      answerResult.classList.add("hidden");
      clearInterval(answerMsgInterval);
    } else {
      answerMsgTimer--;
    }
  }, 1000);

  // Moving to next question
  questionNumber++;
  // Check if end of questions.
  if (questions.length > questionNumber){
    updateTriviaQA(questions, questionNumber);
  } else {
    isActive = false;
    timeRemaining = 0;
    updateTime();
  }
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
