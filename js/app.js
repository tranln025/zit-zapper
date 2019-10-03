
// Timer Countdown Functions
// Every second, reduce countdown by 1 while there is time left. At time=0, stop the countdown, display score, offer "try again" button. On button click, restart countdown
let timeLeft = 30;
const startTimer = () => {
    const timer = setInterval(() => {
        timeLeft --;
        if (timeLeft >= 0) {
            updateTime();
            if (timeLeft === 0) {
                clearInterval(timer);
                // TODO display score and "try again" button
            }
        }
    }, 1000) 
}

const updateTime = () => {
    $(`.countdown`).text(`${timeLeft} seconds`)
}

// When Start is clicked, zoom out of instructions, remove from game screen, and start game
$(`.start`).on(`click`, () => {
    console.log(`START has been clicked`);
    $(`.instructionsContainer`).removeClass(`zoomIn delay-1s`).addClass(`zoomOut`);
    setTimeout(() => {
        $(`.instructionsContainer`).remove();
    }, 1000)
    // TODO create start game fx
    startTimer();
})


// Randomize zit position and time interval
// Source code for elements to appear sporadically and in various sizes: http://jsfiddle.net/redler/QcUPk/8/
// Get time of zit appearance
let appearTime;

function zitAppear(){
    let divsize = (Math.round(Math.random()*100) + 50);
    $newZit = $('<img class="newZit" src="./images/flat-zit-unpopped.png" alt="ripe pimple">').css({
        'width':divsize+'px',
        'height':divsize+'px',
    });
    
    let posx = Math.random() * ($(`.gameScreen`).width() - divsize);
    let posy = Math.random() * (($(`.gameScreen`).height() - divsize) - 50) + 50;
    
    $newZit.css({
        'position':'absolute',
        'left':posx+'px',
        'top':posy+'px',
        'display':'none'
    }).appendTo('.gameScreen').fadeIn(); 

    appearTime = Date.now();
}; 

setInterval(() => {
    let randInterval = Math.random() * 2000;
    setTimeout(() => zitAppear(), randInterval);
}, 2000);


// When clicked, swap image of unpopped zit with popped zit and then add class fadeOutDown. after 2 seconds, remove from document
let clickedTime;
let reactionTime;

$(`.gameScreen`).on(`click`, `.newZit`, function() {
    $(this).attr(`src`, `./images/flat-zit-popped.png`).removeClass(`newZit`).addClass(`poppedZit animated fadeOut delay-1s`);
    setTimeout(() => {
        $(this).remove();
    }, 1500);

    // Get elapsed time between appearance and click of zit
    clickedTime = Date.now();
    reactionTime = clickedTime - appearTime;
    console.log("clicked time: " + clickedTime);
    console.log("appearance time: " + appearTime);
    console.log("reactiontime: " + reactionTime);

    // Award points based on reaction time and update score. Show points earned for each pop
    updatePoints();
});

// Points System
let points = 0;
let pointsEarned = 0;

const updatePoints = () => {
    if (reactionTime < 500) {
        pointsEarned = 5;
    } else if (reactionTime < 700) {
        pointsEarned = 4;
    } else if (reactionTime < 900) {
        pointsEarned = 3;
    } else if (reactionTime < 1000) {
        pointsEarned = 2;
    } else {
        pointsEarned = 1;
    }

    points += pointsEarned;
    $(`#points`).text(`${points}`);

    console.log("points earned: " + pointsEarned);
    console.log("total points: " + points)
    console.log("----------------");

    pointsPopUp();

}

const pointsPopUp = () => {
    $(`.gameScreen`).append(`
        <h3 class="points-earned">+${pointsEarned}</h2>
    `);
    $(`.points-earned`).addClass(`animated fadeInDown`);
    setTimeout(function() {
        $(`.points-earned`).removeClass(`fadeInDown`).addClass(`fadeOut`);
    }, 1000)
}








// TODO / Stretch goals
// Do not allow overlap of zits
// Show amount of points earned per pop below score
// Change cursor to two fingers, coming together on spacebar keydown
// Scoreboard after game end with user input as name
// Add sound effects
// Add rounds into the game? Each round faster generation of zits