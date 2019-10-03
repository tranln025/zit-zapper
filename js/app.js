
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


// // Randomize zit position and time interval
// Source code for elements to appear sporadically and in various sizes: http://jsfiddle.net/redler/QcUPk/8/
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
}; 

setInterval(() => {
    let randInterval = Math.random() * 2000;
    setTimeout(() => zitAppear(), randInterval);
}, 2000);

// when clicked, swap image of unpopped zit with popped zit and then add class fadeOutDown. after 2 seconds, remove() from document
$(`.gameScreen`).on(`click`, `.newZit`, function() {
    console.log('pop', this);
    $(this).removeClass(`newZit`).addClass(`poppedZit animated fadeOut delay-1s`).attr(`src`, `./images/flat-zit-popped.png`);
    setTimeout(() => {
        $(this).remove();
    }, 500)
})