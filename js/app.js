const canvas = document.getElementById('gameScreen');
// getContext('2d') allows you to access the drawing context for 2D graphics
const ctx = canvas.getContext('2d');

// Fill at top of canvas, displays stopwatch and score counter
ctx.fillStyle = 'rgb(255, 124, 110)';
ctx.fillRect(0, 0, canvas.width, 50);

// Stopwatch icon
var stopwatch = new Image();
stopwatch.addEventListener('load', function() {
    console.log('test');
    ctx.drawImage(stopwatch, 10, 10, 27, 30);
}, false);
stopwatch.src = './images/stopwatch-solid.svg';
    // stopwatch source: https://fontawesome.com/icons/stopwatch?style=solid

// Countdown Text
let countdown = 30;
ctx.fillStyle = "white";
ctx.font = "25px Gloria Hallelujah";
ctx.fillText(countdown + " seconds", 50, 35);

// Scoreboard
let points = 0;
ctx.fillStyle = "white";
ctx.font = "25px Gloria Hallelujah";
ctx.fillText("Points: " + points, 570, 35);

// Remove instruction box on button click
$(`.closeInstructions`).on(`click`, () => {
    console.log($(`.instructionsContainer`));
    $(`.instructionsContainer`).removeClass(`zoomIn delay-1s`).addClass(`zoomOut`);
})


// // Small Flat Zit
// var flatZit = new Image();
// flatZit.addEventListener('load', function() {
//     console.log('test');
//     ctx.drawImage(flatZit, 100, 100, 120, 90);
// }, false);
// flatZit.src = './images/flat-zit-unpopped.png';

// // Big Popup Zit
// var bigZit = new Image();
// bigZit.addEventListener('load', function() {
//     console.log('test');
//     ctx.drawImage(bigZit, 500, 300, 200, 100);
// }, false);
// bigZit.src = './images/big-zit.png';

// Small Popup Zit
var smallZit = new Image();
smallZit.addEventListener('load', function() {
    console.log('test');
    ctx.drawImage(smallZit, 500, 300, 100, 50);
}, false);
smallZit.src = './images/small-zit.png';

