const canvas = document.getElementById('gameScreen');
// getContext('2d') allows you to access the drawing context for 2D graphics
const ctx = canvas.getContext('2d');

// Fill at top of canvas, displays stopwatch and score counter
ctx.fillStyle = 'rgb(255, 124, 110)';
ctx.fillRect(0, 0, canvas.width, 50);

// Stopwatch icon
var stopwatch = new Image();
stopwatch.addEventListener('load', function() {
    ctx.drawImage(stopwatch, 10, 10, 27, 30);
}, false);
stopwatch.src = './images/stopwatch-solid.svg';
    // stopwatch source: https://fontawesome.com/icons/stopwatch?style=solid

// Countdown Text
let timeLeft = 30;
ctx.fillStyle = "white";
ctx.font = "25px Gloria Hallelujah";
ctx.fillText(timeLeft, 50, 35);

// Timer Countdown Functions
// Every second, reduce countdown by 1. When no time is left, stop the countdown, display score, offer "try again" button. On button click, restart countdown
const startTimer = () => {
    const timer = setInterval(()=>{    // setInterval ( function, amount of time )
        timeLeft--;
        // Clear previous timer text and replace it each second with updated timeLeft
        ctx.clearRect(40, 0, 50, 50);
        ctx.fillStyle = 'rgb(255, 124, 110)';
        ctx.fillRect(40, 0, 50, 50);
        ctx.fillStyle = "white";
        ctx.font = "25px Gloria Hallelujah";
        ctx.fillText(timeLeft, 50, 35);
        if (timeLeft === 0) {
            clearInterval(timer);
        }
    }, 1000) 
    return;
}

// Scoreboard
let points = 0;
ctx.fillStyle = "white";
ctx.font = "25px Gloria Hallelujah";
ctx.fillText("Points: " + points, 570, 35);

// When Start, remove instructions and start game
$(`.start`).on(`click`, () => {
    console.log(`START has been clicked`);
    $(`.instructionsContainer`).removeClass(`zoomIn delay-1s`).addClass(`zoomOut`);
    // TODO create start game fx
    startTimer();
})

// // Big Popup Zit
// var bigZit = new Image();
// bigZit.addEventListener('load', function() {
//     console.log('test');
//     ctx.drawImage(bigZit, 500, 300, 200, 100);
// }, false);
// bigZit.src = './images/big-zit.png';

// // Small Popup Zit
// var smallZit = new Image();
// smallZit.addEventListener('load', function() {
//     console.log('test');
//     ctx.drawImage(smallZit, 500, 300, 100, 50);
// }, false);
// smallZit.src = './images/small-zit.png';

// Small Flat Zit
var flatZit = new Image();
// Function to draw the zit. Start button triggers drawing. 
// ctx.drawImage(flatZit, 100, 100, 110, 90);
flatZit.src = './images/flat-zit-unpopped.png';

// Randomize zit position
const randomZit = () => {
    let x = Math.random() * (canvas.width - 120) + 30;
    let y = Math.random() * (canvas.height - 200) + 60;
    flatZit.addEventListener('load', function() {
        ctx.drawImage(flatZit, x, y, 110, 90);
    }, false);
};

// in span of random time from 0 to 30 seconds, run random zit function
const randomTimeInterval = (Math.random() * 5000) + 1000;
const zitPopUp = setInterval(randomZit(), randomTimeInterval);

// If zit clicked, change image to popped zit and then disappear
