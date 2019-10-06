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
        for (let i = 0; i < game.zits.length; i++) {
            let fingersPos = $fingers.position();
            if (fingersPos.left + 59 > game.zits[i].position.left + (.25 * game.zits[i].size) && 
            fingersPos.left + 59 < game.zits[i].position.left + (.75 * game.zits[i].size) &&
            fingersPos.top + 14 > game.zits[i].position.top + (.25 * game.zits[i].size) &&
            fingersPos.top + 14 < game.zits[i].position.top + (.75 * game.zits[i].size)) {

                // Pop the zit
                $(`#${i}`).attr(`src`, `./images/flat-zit-popped.png`).removeClass(`newZit`).addClass(`poppedZit animated fadeOut delay-1s`);
                setTimeout(() => {
                    $(`#${i}`).remove();
                }, 1500);

                // Get elapsed time between appearance and click of zit
                clickedTime = Date.now();
                reactionTime = clickedTime - game.zits[i].time;
                console.log("clicked time: " + clickedTime);
                console.log("appearance time: " + game.zits[i].time);
                console.log("reactiontime: " + reactionTime);

                // Award points based on reaction time and update score. Show points earned for each pop
                game.updatePoints();
            }
        }
    }
})
    



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
    getName();

}




// ---------------------------------------------------------------
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// ---------------------------------------------------------------

class Game {
    constructor () {
        this.timeLeft = 30;
        this.round = 1;
        this.points = 0;
        this.pointsEarned = 0;
        this.player = player;   
        this.zits = []; 
        this.leaderboard = []
    }

    // Timer Countdown Functions
    // Every second, reduce countdown by 1 while there is time left. At time=0, stop the countdown, display score, offer "try again" button. On button click, restart countdown
    startTimer() {
        const timer = setInterval(() => {
            this.timeLeft --;
            if (this.timeLeft >= 0) {
                this.updateTime();
                if (this.timeLeft <= 5) {
                    $(`.countdown`).css({
                        'color': 'red',
                        'font-weight': 'bold'
                    });
                }
                    if (this.timeLeft === 0) {
                        clearInterval(timer);
                        this.endGame();
                }
            }
        }, 1000) 
    }

    updateTime() {
        $(`.countdown`).text(`${this.timeLeft} seconds`)
    }

    // Randomize zit position and time interval
    // Source code for elements to appear sporadically and in various sizes: http://jsfiddle.net/redler/QcUPk/8/

    zitAppear() {

        // Generates random size of zit
        let zitSize = (Math.round(Math.random()*100) + 50);
        $newZit = $(`<img class="newZit animated pulse" id="${this.zits.length}" src="./images/flat-zit-unpopped.png" alt="ripe pimple">`).css({
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
            id: this.zits.length,
            time: appearTime,
            position: zitPos,
            size: zitSize,
        }
        this.zits.push(thisZit);
        
        // Appends zit to document
        $newZit.css({
            'position':'absolute',
            'left':posx+'px',
            'top':posy+'px',
            'display':'none'
        }).appendTo('.gameScreen').fadeIn(); 
    }; 

    // Points System
    updatePoints() {
        if (reactionTime < 1000) {
            this.pointsEarned = 5;
        } else if (reactionTime < 2000) {
            this.pointsEarned = 4;
        } else if (reactionTime < 3000) {
            this.pointsEarned = 3;
        } else if (reactionTime < 4000) {
            this.pointsEarned = 2;
        } else {
            this.pointsEarned = 1;
        }
    
        this.points += this.pointsEarned;
        $(`#points`).text(`${this.points}`);
    
        console.log("points earned: " + this.pointsEarned);
        console.log("total points: " + this.points)
        console.log("----------------");
    
        this.pointsPopUp();
    }
    
    pointsPopUp() {
        $(`.gameScreen`).append(`
            <h3 class="points-earned">+${this.pointsEarned}</h2>
        `);
        $(`.points-earned`).addClass(`animated fadeInDown`);
        setTimeout(function() {
            $(`.points-earned`).removeClass(`fadeInDown`).addClass(`fadeOut`);
        }, 1000)
    }

    getName() {
        // Append form to input player name
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

        // On submit, push input value into array, remove form and replace 
        $(`form`).on(`submit`, function () {
            event.preventDefault();
            this.leaderboard.push({
                name: $(`input:text`).val(),
                score: this.points
            })
        })
    }

    // Display final score and top 3

    

    // Function to play entire game
    playGame() {
        
    }


}

// When Start is clicked, zoom out of instructions, remove from game screen, start timer, generate zits
$(`.start`).on(`click`, () => {
    console.log(`START has been clicked`);
    $(`.instructionsContainer`).removeClass(`zoomIn delay-1s`).addClass(`zoomOut`);
    setTimeout(() => {
        $(`.instructionsContainer`).remove();
    }, 1000)
    game.startTimer();

    // Each 2 seconds, zitAppear is run
    setInterval(() => {
        let randInterval = Math.random() * 2000;
        setTimeout(() => game.zitAppear(), randInterval);
    }, 2000);
})



// class Player {
//     constructor (name, finalPoints) {
//         this.name = name;
//         this.points = finalPoints;
//     }

// }


const game = new Game();
game.




// TODO / Stretch goals
// Do not allow overlap of zits
    // Get position of zit
    // put all zits with class .newZit and .poppedZit in an array
    // get each zit's coordinates
// Change cursor to two fingers, coming together on spacebar keydown
// Scoreboard after game end with user input as name
// Add sound effects
// Add rounds into the game? Each round faster generation of zits