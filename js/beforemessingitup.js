// Timer Countdown Functions
// Every second, reduce countdown by 1 while there is time left. At time=0, stop the countdown, display score, offer "try again" button. On button click, restart countdown
let timeLeft = 30;
const startTimer = () => {
    const timer = setInterval(() => {
        timeLeft --;
        if (timeLeft >= 0) {
            updateTime();
            if (timeLeft <= 5) {
                $(`.countdown`).css({
                    'color': 'red',
                    'font-weight': 'bold'
                });
            }
                if (timeLeft === 0) {
                    clearInterval(timer);
                    endGame();
            }
        }
    }, 1000) 
}

const updateTime = () => {
    $(`.countdown`).text(`${timeLeft} seconds`)
}


// Navigate in the gameScreen using arrow keys
// Source: https://stackoverflow.com/questions/4950575/how-to-move-a-div-with-arrow-keys

var $gameWindow = $('.gameScreen'),
    $fingers = $('#fingersApart'),
    maxWidth = $gameWindow.width() - $fingers.width(),
    maxHeight = $gameWindow.height() - $fingers.height(),
    keysPressed = {},
    distanceMoved = 5;

function calculateNewWidth(oldValue,a,b) {
    var n = parseInt(oldValue, 10) - (keysPressed[a] ? distanceMoved : 0) + (keysPressed[b] ? distanceMoved : 0);
    return n < 0 ? 0 : n > maxWidth ? maxWidth : n;
}
function calculateNewHeight(oldValue,a,b) {
    var n = parseInt(oldValue, 10) - (keysPressed[a] ? distanceMoved : 0) + (keysPressed[b] ? distanceMoved : 0);
    return n < 50 ? 50 : n > maxHeight ? maxHeight : n;
}

$(window).keydown(function(e) { keysPressed[e.which] = true; });
$(window).keyup(function(e) { keysPressed[e.which] = false; });

setInterval(function() {
    $fingers.css({
        left: function(i, oldValue) { 
            return calculateNewWidth(oldValue, 37, 39); 
        },
        top: function(i, oldValue) { 
            return calculateNewHeight(oldValue, 38, 40); 
        }
    });
}, 20);


// Randomize zit position and time interval
// Source code for elements to appear sporadically and in various sizes: http://jsfiddle.net/redler/QcUPk/8/
let zits = []

function zitAppear() {

    // Generates random size of zit
    let zitSize = (Math.round(Math.random()*100) + 50);
    $newZit = $(`<img class="newZit animated pulse" id="${zits.length}" src="./images/flat-zit-unpopped.png" alt="ripe pimple">`).css({
        'width':zitSize+'px',
        'height':zitSize+'px',
    });
    
    // Generates random position of zit
    let posx = Math.random() * ($(`.gameScreen`).width() - zitSize - 50) + 20;
    let posy = Math.random() * (($(`.gameScreen`).height() - zitSize) - 40) + 40;
    let zitPos = {
        left: posx,
        top: posy
    }

    // Get time of zit appearance for time elapsed later
    let appearTime = Date.now();

    // Push each generated zit into zits array as an object
    appearTime;
    let thisZit = {
        id: zits.length,
        time: appearTime,
        position: zitPos,
        size: zitSize,
    }
    zits.push(thisZit);
    
    // Appends zit to document
    $newZit.css({
        'position':'absolute',
        'left':posx+'px',
        'top':posy+'px',
        'display':'none'
    }).appendTo('.gameScreen').fadeIn(); 
}; 


// When Start is clicked, zoom out of instructions, remove from game screen, start timer, generate zits
$(`.start`).on(`click`, () => {
    console.log(`START has been clicked`);
    $(`.instructionsContainer`).removeClass(`zoomIn delay-1s`).addClass(`zoomOut`);
    setTimeout(() => {
        $(`.instructionsContainer`).remove();
    }, 1000)
    startTimer();

    // Each 2 seconds, zitAppear is run
    setInterval(() => {
        let randInterval = Math.random() * 2000;
        setTimeout(() => zitAppear(), randInterval);
    }, 2000);
})



// When fingers overlap zit and spacebar is pressed:
    // change img of fingers apart to fingers together
    // swap image of unpopped zit with popped zit, update classes
    // after 1.5 seconds, remove from document
// To determine if fingers overlap a zit:
    // If fingers center x coordinate is within zit x boundaries AND fingers center y coordinate is within zit y boundaries, pop zit

    $(window).on(`keydown`, (event) => {
        // If spacebar is pressed,
        if (event.which === 32) {
            // Finger squeeze
            $(`#fingersApart`).attr(`src`, `./images/fingers-together-small-2.png`)
            setTimeout(() => {
                $(`#fingersApart`).attr(`src`, `./images/fingers-apart-small-2.png`)
            }, 500)
    
            // For each zit on screen, if fingers overlap,
            for (let i = 0; i < zits.length; i++) {
                let fingersPos = $fingers.position();
                if (fingersPos.left + 59 > zits[i].position.left + (.25 * zits[i].size) && 
                fingersPos.left + 59 < zits[i].position.left + (.75 * zits[i].size) &&
                fingersPos.top + 14 > zits[i].position.top + (.25 * zits[i].size) &&
                fingersPos.top + 14 < zits[i].position.top + (.75 * zits[i].size)) {
    
                    // Pop the zit
                    $(`#${i}`).attr(`src`, `./images/flat-zit-popped.png`).removeClass(`newZit`).addClass(`poppedZit animated fadeOut delay-1s`);
                    setTimeout(() => {
                        $(`#${i}`).remove();
                    }, 1500);

                    // Get elapsed time between appearance and click of zit
                    clickedTime = Date.now();
                    reactionTime = clickedTime - zits[i].time;
                    console.log("clicked time: " + clickedTime);
                    console.log("appearance time: " + zits[i].time);
                    console.log("reactiontime: " + reactionTime);

                    // Award points based on reaction time and update score. Show points earned for each pop
                    updatePoints();
                }
            }
        }
    })
    

// Points System
let points = 0;
let pointsEarned = 0;

const updatePoints = () => {
    if (reactionTime < 1000) {
        pointsEarned = 5;
    } else if (reactionTime < 2000) {
        pointsEarned = 4;
    } else if (reactionTime < 3000) {
        pointsEarned = 3;
    } else if (reactionTime < 4000) {
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

// Game Over screen
// Retrieve user name
// Display top 3 names and scores

const leaderboard = [];
const players = [];
const scores = [];

const endGame = () => {
    // get user name input
    // add name to array
    // sort array descending order
    // display winner as names[0]
    appendForm();

    

    
}

// Append form to input player name
const appendForm = () => {
    $(`.gameContainer`).append(`
        <div class="gameOver animated zoomIn delay-1s">
            <h3>GAME OVER</h3>
            <p>Enter your name to see where you stand</p>
            <form action="/action_page.php">
                <input type="text">
                <input type="submit" value="Submit">
            </form>
        </div>
    `);
}

// On submit, push input value into array, remove form and replace 
$(`form`).on(`submit`, function () {
    event.preventDefault();
    leaderboard.push({
        name: $(`input:text`).val(),
        score: 0
    }
    )
})

class Game {
    constructor (player) {
        this.round = 0;
        this.points = points;
        this.player = player;    
    }
    
}

class Player {
    constructor (name, finalPoints) {
        this.name = name;
        this.points = finalPoints;
    }

}








// TODO / Stretch goals
// Do not allow overlap of zits
    // Get position of zit
    // put all zits with class .newZit and .poppedZit in an array
    // get each zit's coordinates
// Change cursor to two fingers, coming together on spacebar keydown
// Scoreboard after game end with user input as name
// Add sound effects
// Add rounds into the game? Each round faster generation of zits