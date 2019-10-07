// Timer Countdown Functions
// Every second, reduce countdown by 1 while there is time left. At time=0, stop the countdown, display score, offer "try again" button. On button click, restart countdown
let timeLeft = 30;

const startTimer = () => {
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
                // setInterval(() => {
                //     $(`.newZit`).remove();
                // }, 20)
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
            // Generate zits at 1500 speed
            if (lastTimeCall > 20) {
                clearInterval(currRound);
                currRound = null;
            }
            if (currRound) {
                return;
            }
            currRound = setInterval( () => {
                let randInterval = Math.random() * 1500;
                setTimeout(() => createZit(), randInterval);
            }, 1500)    
        } else if (timeLeft > 0 && timeLeft <= 10) {
            // Round 3
            // Generate zits at 1000 speed
            if (lastTimeCall > 10) {
                clearInterval(currRound);
                currRound = null;
            }
            if (currRound) {
                return;
            }
            currRound = setInterval( () => {
                let randInterval = Math.random() * 1000;
                setTimeout(() => createZit(), randInterval);
            }, 1000)    
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

    // // Each 2 seconds, createZit is run
    // setInterval(() => {
    //     let randInterval = Math.random() * 2000;
    //     setTimeout(() => createZit(), randInterval);
    // }, 2000);
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

                // Check if the zit has been popped. If not, award points based on reaction time and update score. Show points earned for each pop
                // TODO this doesn't work ://
                // if ($(`#${i}`).hasClass("poppedZit") === false) {
                    updatePoints();
                // }
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
    }, 1000);
    setTimeout(function() {
        $(`.points-earned`).remove();
    }, 2000)
}


// Game Over screen & leaderboard

// Dummy values in array so no values show up undefined
const leaderboard = [{ name: "", score: "" }, { name: "", score: "" }, { name: "", score: "" }];

// Append input form to get player name, display score, show leaderboard
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
    
        // Push inputted name and score into array
        leaderboard.push({
            name: $(`input:text`).val(),
            score: points
        });

        // Sort array by player scores
        // Source: https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        leaderboard.sort( (a, b) => (a.score < b.score ? 1 : -1));
        console.log(leaderboard);

        // Replace form with leaderboard
        $(`.gameOver`).html(`
            <h2>Your score: ${points}</h2>
            <h2 id="leaderboard-header">LEADERBOARD</h2>
            <ol>
                <li>${leaderboard[0].name} --- ${leaderboard[0].score}</li>
                <li>${leaderboard[1].name} --- ${leaderboard[1].score}</li>
                <li>${leaderboard[2].name} --- ${leaderboard[2].score}</li>
            </ol>
            <button id="replay">PLAY AGAIN</button>
        `);

        // When replay button is pressed, remove gameOver div, start timer again, generate zits
        $(`#replay`).on(`click`, () => {
            $(`.gameOver`).remove();
            $(`.newZit`).remove();
            timeLeft = 30;
            points = 0;
            updateTime();
            $(`#points`).text(`${points}`);
            startTimer();
        })
    })
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