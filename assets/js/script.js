var difficultySelector = document.querySelector("#difficultySelector");
var titleMessage = document.querySelector("#titleMessage");
var timerMessage = document.querySelector("#timerMessage");
var startButton = document.querySelector("#startButton");
var resetButton = document.querySelector("#resetButton");
var questionBox = document.querySelector("#questionBox");
var questionAnswers = document.querySelector("#questionAnswers");
var answerResult = document.querySelector("#answerResult");
var scoreMessage = document.querySelector("#scoreMessage");
var saveScoreButton = document.querySelector("#saveScoreButton");
var scoreBoard = document.querySelector("#scoreBoard");
var submitScoreButton = document.querySelector("#submitScoreButton");
var submitScore = document.querySelector("#submitScore");
var username = document.querySelector("#username");

var gameInitiated = false;
var timeDefault = 5;
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
  }
});

startButton.addEventListener("click", function (event) {
  event.preventDefault();

  startButton.classList.add("hidden");
  resetButton.classList.remove("hidden");
  startGame();
});


resetButton.addEventListener("click", function (event) {
  reset = true;
  event.preventDefault();

  scoreBoard.classList.add('hidden');
  questionBox.classList.remove('hidden');
  questionAnswers.classList.remove('hidden');
  if (isActive === false){
    startGame()
  }
});

saveScoreButton.addEventListener("click", function (event) {
  reset = true;
  event.preventDefault();
  saveScoreButton.classList.add("hidden");
  submitScore.classList.remove("hidden");
  clickSaveScore();
});

submitScoreButton.addEventListener("click", function (event) {
  event.preventDefault();
  var name = username.value
  var currentStorage = JSON.parse(localStorage.getItem('scoreBoard'));
  if(currentStorage === null){
    currentStorage = []
  }

  currentStorage.push({'score': score, 'difficulty': difficultyMode ,'name': name})
  localStorage.setItem('scoreBoard', JSON.stringify(currentStorage));
  updateScoreBoard();
  submitScore.classList.add("hidden");

});

questionAnswers.addEventListener("click", function (event) {
  event.preventDefault();
  if(isActive === true){
    clickCheckAnswer(event);
  }
});


async function startGame() {
  titleMessage.textContent = "Random Trivia - Good luck!";
  isActive = true
  questionNumber = 0;
  questions = await getQuestions();
  score = 0;
  timeRemaining = timeDefault;

  // Avoid update if resetting.
  if (reset !== true) {
    updateTriviaQA(questions, questionNumber);
  }

  //  set time interval timer of 1second.
  var timerInterval = setInterval(function () {
    if (reset === true) {
      // waiting for timerInterval to be cleared before resetting.
      reset = false;
      isActive = false;
      clearInterval(timerInterval)
      startGame();
    } else {
      if (timeRemaining > 0) {
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
  var apiResponse = await fetch(
    "https://api.trivia.willfry.co.uk/questions?limit=20"
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      // window.apiResponseData  = data
      return data;
    });
  return apiResponse;
}

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
    if (answerMsgTimer <= 0) {
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

function endGame() {
  titleMessage.textContent = "Random Trivia - Out of Time!";
  // show saveScore button, hide questions
  saveScoreButton.classList.remove('hidden');
  questionBox.classList.add('hidden');
  questionAnswers.classList.add('hidden');

}

function clickSaveScore() {
  scoreBoard.classList.remove('hidden');
  updateScoreBoard();
}

function updateScoreBoard(){
  var currentStorage = JSON.parse(localStorage.getItem('scoreBoard'));
  var scoreBoardTable = document.querySelector('#scoreBoardTable')

  scoreBoardTable.innerHTML = "";
  
  // Creating the table headers.
  var tableHeaderRow = document.createElement('tr');
  var scoreHeaderEle = document.createElement('th');
  var difficultyHeaderEle = document.createElement('th');
  var nameHeaderEle = document.createElement('th');

  scoreHeaderEle.textContent = "Score"
  difficultyHeaderEle.textContent = "Difficulty"
  nameHeaderEle.textContent = "Name"

  tableHeaderRow.append(scoreHeaderEle);
  tableHeaderRow.append(difficultyHeaderEle);
  tableHeaderRow.append(nameHeaderEle);
  scoreBoardTable.append(tableHeaderRow);

  // sort the current storage
  if(currentStorage.length > 1){
    currentStorage.sort( compareDescending );
  }

  // Append each row of saved scores
  for(var i = 0; i < currentStorage.length; i++){
    var tableRow = document.createElement('tr');
    var scoreEle = document.createElement('td');
    var difficultyEle = document.createElement('td');
    var nameEle = document.createElement('td');

    scoreEle.textContent = currentStorage[i].score
    difficultyEle.textContent = currentStorage[i].difficulty
    nameEle.textContent = currentStorage[i].name

    tableRow.append(scoreEle);
    tableRow.append(difficultyEle);
    tableRow.append(nameEle);
    scoreBoardTable.append(tableRow);
  }

}

function compareDescending( a, b ) {
// sort current object and next object by score key
  if ( a.score > b.score ){
    return -1;
  }
  if ( a.score < b.score ){
    return 1;
  }
  return 0;
}


