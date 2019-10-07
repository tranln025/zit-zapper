// Pop sound effect
const pop = new Audio();
pop.src = "../sounds/pop.mp3"


// Timer Countdown Functions
// When timer starts, reset round
// Every second, reduce countdown by 1 while there is time left.
// At 5 seconds or less on the clock, display score in red
// Check value of timeLeft to determine when new round starts and increase speed
// At time=0, display end game screen
let timeLeft = 30;

const startTimer = () => {
    $(`.round h3`).text(`Round 1`);
    let zitSpawnChanger = adjustZitSpawnSpeed();
    const timer = setInterval(() => {
        if (timeLeft >= 0) {
            updateTime();
            zitSpawnChanger(timeLeft);
            if (timeLeft <= 5) {
                $(`.countdown`).css({
                    'color': 'red',
                    'font-weight': 'bold'
                });
            }
            if (timeLeft === 0) {
                clearInterval(timer);
                endGame();
            };
        }
        timeLeft --;
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

$(window).keydown(function(e) {
     keysPressed[e.which] = true; 
});
$(window).keyup(function(e) { 
    keysPressed[e.which] = false; 
});

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

function createZit() {

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


// Random generation of zits, gets faster every 10 sec. If timeLeft = 0, do not generate any

const adjustZitSpawnSpeed = () => {
    let currRound = null;
    let lastTimeCall = null;
    return (timeLeft) => {
        if (timeLeft > 20 && timeLeft <= 30) {
            // Round 1
            // Generate zits at 2000 speed 
            if (currRound) {
                return;
            }
            createZit();
            currRound = setInterval( () => {
                let randInterval = Math.random() * 2000;
                setTimeout(() => createZit(), randInterval);
            }, 2000)   
        } else if (timeLeft > 10 && timeLeft <= 20) {
            // Round 2
            // Update round
            // Generate zits at 1300 speed
            if (lastTimeCall > 20) {
                clearInterval(currRound);
                currRound = null;
                $(`.round h3`).text(`Round 2`);
                $(`.round h3`).addClass(`animated tada`);
                setTimeout(() => {
                    $(`.round h3`).removeClass(`animated tada`);
                }, 1500);
            }
            if (currRound) {
                return;
            }
            currRound = setInterval( () => {
                let randInterval = Math.random() * 1300;
                setTimeout(() => createZit(), randInterval);
            }, 1300)    
        } else if (timeLeft > 0 && timeLeft <= 10) {
            // Round 3
            // Update round
            // Generate zits at 900 speed
            if (lastTimeCall > 10) {
                clearInterval(currRound);
                currRound = null;
                $(`.round h3`).text(`Round 3`);
                $(`.round h3`).addClass(`animated tada`);
                setTimeout(() => {
                    $(`.round h3`).removeClass(`animated tada`);
                }, 1500);
            }
            if (currRound) {
                return;
            }
            currRound = setInterval( () => {
                let randInterval = Math.random() * 900;
                setTimeout(() => createZit(), randInterval);
            }, 900)    
        } else {
            clearInterval(currRound);
        }
        lastTimeCall = timeLeft;
    }
};


// When Start is clicked, zoom out of instructions, remove from game screen, start timer, generate zits
$(`.start`).on(`click`, () => {
    console.log(`START has been clicked`);
    $(`.instructionsContainer`).removeClass(`zoomIn delay-1s`).addClass(`zoomOut`);
    setTimeout(() => {
        $(`.instructionsContainer`).remove();
    }, 1000)
    startTimer();
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
                pop.play();
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
    $(`#points`).text(`Points: ${points}`);

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
    }, 1000);
    setTimeout(function() {
        $(`.points-earned`).remove();
    }, 2000)
}


// Game Over screen & leaderboard

// Create empty leaderboard object
let leaderboard = {"": ""};

// If a leaderboard exists in local storage, retrieve it and put into our leaderboard
const localStorage = window.localStorage;
const lsLeaderboard = localStorage.getItem("leaderboard");
if (lsLeaderboard) {
    leaderboard = JSON.parse(lsLeaderboard);
}

// Append input form to get player name
const endGame = () => {
    $(`.gameContainer`).append(`
        <div class="gameOver animated zoomIn delay-1s">
            <br/>
            <h2>GAME OVER</h2>
            <h3>Enter your name to see where you stand</h3>
            <form>
                <input type="text">
                <button type="submit" value="Submit">Submit</button>
            </form>
        </div>
    `);

    // On Submit, 
    $(`form`).on(`submit`, function (event) {
        event.preventDefault();
    
        // Add key/value pair of inputted name and score into leaderboard
        leaderboard[$(`input:text`).val()] = points;

        // Sort leaderboard by player scores
        // Source: https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        let descendingKeys = Object.keys(leaderboard).sort( (a, b) => (leaderboard[a] < leaderboard[b]? 1 : -1));

        let firstPlace = descendingKeys[0];
        let secondPlace = descendingKeys.length > 1 ? descendingKeys[1] : "";
        let thirdPlace = descendingKeys.length > 2 ? descendingKeys[2] : "";

        // Replace form with score and leaderboard
        $(`.gameOver`).html(`
            <h2>Your score: ${points}</h2>
            <h2 id="leaderboard-header">LEADERBOARD</h2>
            <ol>
                <li>${firstPlace} --- ${leaderboard[firstPlace]}</li>
                <li>${secondPlace} --- ${leaderboard[secondPlace]}</li>
                <li>${thirdPlace} --- ${leaderboard[thirdPlace]}</li>
            </ol>
            <button id="replay">PLAY AGAIN</button>
        `);
 
        // Add updated leaderboard to local storage
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

        // When replay button is pressed, remove gameOver div, remove all zits, reset points, restart timer.
        $(`#replay`).on(`click`, () => {
            $(`.gameOver`).remove();
            $(`.newZit`).remove();
            timeLeft = 30;
            $(`.countdown`).css({
                'color': 'white',
                'font-weight': 'bold'
            });
            points = 0;
            updateTime();
            $(`#points`).text(`Points: ${points}`);
            startTimer();
        })
    })
}