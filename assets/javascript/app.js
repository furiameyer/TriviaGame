// Declare VARIABLES
// --------------------------------------------------------------------------------------------------------------------
var remainingTime;
var roundCounter;
var interval;
var timesUp;
var wonRound;
var targetElement;
var wins;
var misses;
var unanswered;
var progress;

var triviaDB = [
{   Question: "Tasmania is an isolated island state belonging to which country?",
    Answer: "Australia",
    Image: "assets/images/australia.gif",
    Options: ["Australia", "New Zealand", "Madagascar", "Argentina"]},
{   Question: "Which American actor performs music under the stage name Childish Gambino?",
    Answer: "Donald Glover",
    Image: "assets/images/dglover.gif",
    Options: ["Donald Glover", "Al Pacino", "Arnold Schwarzelonger", "Leo Di Caprio"]},
{   Question: "The Portuguese motto, “Ordem E Progresso”, is found on which country’s national flag?",
    Answer: "Brazil",
    Image: "assets/images/brazil.gif",
    Options: ["Brazil", "Zimbawe", "Portugal", "Guyana"]},
{   Question: "Girl with a Pearl Earring is an oil painting by which Dutch Golden Age painter?",
    Answer: "Johannes Vermeer",
    Image: "assets/images/jvermeer.jpg",
    Options: ["Johannes Vermeer", "Picasso", "Robert Van Dyke", "Vincent Van Gogh"]},
{   Question: "How many electrons does a hydrogen atom have?",
    Answer: "One",
    Image: "assets/images/hydrogen.gif",
    Options: ["One", "Two", "Eight", "Ten Thousand"]},
{   Question: "What song from the Disney film “Coco” won the 2018 Academy Award for Best Original Song?",
    Answer: "Remember Me",
    Image: "assets/images/cocoremember.gif",
    Options: ["Remember Me", "Coco Tonight", "Day of the Death", "Baila Conmigo"]},
{   Question: "In the X-Men film franchise, Halle Berry played the role of which character?",
    Answer: "Storm",
    Image: "assets/images/storm.gif",
    Options: ["Storm", "Mystique", "Rogue", "Jubilee"]},
{   Question: "In Olympic archery, what is the standard distance of the target from the archer?",
    Answer: "70 Meters",
    Image: "assets/images/archery.jpg",
    Options: ["70 Meters", "100 Feet", "100 Meters", "300 Feet"]}
];

// Define FUNCTIONS
// --------------------------------------------------------------------------------------------------------------------

// This function shuffles the contents of an array
// It is used for ensuring that the sort order of the questions and the answer options is never the same
Array.prototype.shuffle = function() {
    var input = this;
     
    for (var i = input.length-1; i >=0; i--) {
     
        var randomIndex = Math.floor(Math.random()*(i+1)); 
        var itemAtIndex = input[randomIndex]; 
         
        input[randomIndex] = input[i]; 
        input[i] = itemAtIndex;
    }
    return input;
};

// Build timer functionality and display it
function showTimer() {
    var timer = $("<p>");
    timer.text("Time Remaining: " + remainingTime + " seconds");
    timer.addClass("timer");
    $("#gameProgress").prepend(timer);
};

function decrement() {
    $(".timer").empty();
    remainingTime--;
    if (remainingTime === 0) {
        stop();
        timesUp = true;
        unanswered++;
        Outcome();
    } else {
        showTimer();
    };
};

// Generate question and display possible answers
function runQuestion() {
    targetElement = triviaDB[roundCounter-1];
    var questionDOM = $("<p>");
    questionDOM.addClass("font-weight-bold");
    questionDOM.text(targetElement.Question);
    $("#gameProgress").append(questionDOM);
    
    targetElement.Options.shuffle();
    for (var i=0;i<4;i++) {
        var answerLoop = targetElement.Options[i];
        var answerDOM = $("<p>");
        answerDOM.text(answerLoop);
        answerDOM.attr("data-answer", answerLoop);
        answerDOM.addClass("answerChoices list-group-item list-group-item-action");
        $("#gameProgress").append(answerDOM);
    };
};

// Update progress bar at bottom
function updateProgressBar(progress) {
    var width = "width: " + (progress*100) + "%";
    var progressBarDiv = $("<div>");
    progressBarDiv.addClass("progress");
    progressBarDiv.attr("style", "margin-top: 30px;");
    var progressBar = $("<div>");
    progressBar.addClass("progress-bar progress-bar-striped bg-warning");
    progressBar.attr("role", "progressbar");
    progressBar.attr("style", width);
    progressBarDiv.append(progressBar);
    $("#gameProgress").append(progressBarDiv);
    console.log(progressBarDiv);
}

// Launch game
function kickoff () {
    triviaDB.shuffle();
    roundCounter = 0;
    timesUp = false;
    wonRound = false;
    wins=0;
    misses=0;
    unanswered=0;
    progress=0;
    newRound();
};   

// Generate new round
function newRound() {
    if (roundCounter==8) {
        finalScreen();
    } else {
        clearScreen();
        remainingTime = 30;
        timesUp = false;
        wonRound = false;
        roundCounter++;
        progress = (roundCounter)/8;
        console.log(roundCounter);
        console.log("progress"+progress);
        showTimer();
        runQuestion();
        updateProgressBar(progress);
        clearInterval(interval);
        interval = setInterval(decrement, 1000);
    };
};

// Display round outcome screen
function Outcome() {
    clearScreen();
    var outcome = $("<h2>");

    if (wonRound) {
        outcome.text("You Are Right!");
    } else if (timesUp) {
        outcome.text("You ran out of time, sniff, sniff");
    } else {
        outcome.text("Wrong Answer!");
    };

    var correctAns = $("<p>");
    correctAns.text("The correct answer was " + targetElement.Answer)
    var correctPic = $("<img>");
    correctPic.attr("src", targetElement.Image);
    correctPic.attr("style", "max-width: 350px;");
    $("#gameProgress").append(outcome,correctAns,correctPic);

    var wait = setTimeout(newRound, 4500);
};

// Display final game outcome screen
function finalScreen () {
    clearScreen ();
    var allDone = $("<h2>");
    allDone.text("All done! Here's how you did!");
    var correctAns = $("<p>")
    correctAns.text("Correct Answers: " + wins);
    var incorrectAns = $("<p>")
    incorrectAns.text("Incorrect Answers: " + misses);
    var unansweredAns = $("<p>")
    unansweredAns.text("Unanswered: " + unanswered);
    var play = $("<button>");
    play.text("Click to Start Over");
    play.addClass("replay");
    $("#gameProgress").append(allDone,correctAns,incorrectAns,unansweredAns,play);
    $("#gameProgress").on("click", ".replay",kickoff);
};

// Launch button
function startupScreen () {
    var play = $("<button>");
    play.text("Ready to Play? Press Here!");
    play.addClass("play");
    $("#gameProgress").append(play);
    $("#gameProgress").on("click", ".play", kickoff);
};

// Utalitarian functions
function clearScreen() {
    $("#gameProgress").empty();
}

function stop() {
    clearInterval(interval);
};

// LAUNCH GAME
// --------------------------------------------------------------------------------------------------------------------
startupScreen();

// Set up Click event listener
// --------------------------------------------------------------------------------------------------------------------
$(document).on("click",".answerChoices", function(){
    stop();
    var answerSelection = $(this).attr("data-answer");
    if (answerSelection === targetElement.Answer) {
        wins++;
        console.log("Wins: " + wins);
        wonRound = true
    } else {
        misses++;
        console.log("Losses: " + misses);
    };
    Outcome();
});