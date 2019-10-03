
// Timer Countdown Functions
// Every second, reduce countdown by 1. When no time is left, stop the countdown, display score, offer "try again" button. On button click, restart countdown
let timeLeft = 30;
const startTimer = () => {
    const timer = setInterval(()=>{    // setInterval ( function, amount of time )
        timeLeft --;
        if (timeLeft === 0) {
            clearInterval(timer);
            // TODO insert "try again" button
        }
        updateTime();
    }, 1000) 
}

const updateTime = () => {
    $(`.countdown`).text(`${timeLeft} seconds`)
}

// When Start is clicked, remove instructions and start game
$(`.start`).on(`click`, () => {
    console.log(`START has been clicked`);
    $(`.instructionsContainer`).removeClass(`zoomIn delay-1s`).addClass(`zoomOut`);
    // TODO create start game fx
    startTimer();
})


// // Randomize zit position and time interval
// const randomZitPos = () => {
//     let x = Math.random() * ($(`.gameScreen`).width - 120) + 30;
//     let y = Math.random() * ($(`.gameScreen`).height - 200) + 60;
//     $(`.gameScreen`).append(`<img class="ripeZit" src="./images/flat-zit-unpopped.png" alt="ripe pimple">`);
// };

// const randomTimeInterval = (Math.random() * 5000) + 1000;
// const zitPopUp = () => {
//     setInterval(randomZitPos(), randomTimeInterval);
// }

// Code for elements to appear sporadically and in various sizes. Source: http://jsfiddle.net/redler/QcUPk/8/
function zitAppear(){
    let divsize = (Math.round(Math.random()*100) + 50);
    $newZit = $('<img class="newZit" src="./images/flat-zit-unpopped.png" alt="ripe pimple">').css({
        'width':divsize+'px',
        'height':divsize+'px',
    });
    
    let posx = Math.random() * ($(`.gameScreen`).width() - divsize);
    let posy = Math.random() * (($(`.gameScreen`).height() - divsize) - 50) + 50;
    let randDelay = Math.random() * 20000;
    
    $newZit.css({
        'position':'absolute',
        'left':posx+'px',
        'top':posy+'px',
        'display':'none'
    }).appendTo('.gameScreen').fadeIn().delay(randDelay); 
}; 

zitAppear();


// when clicked, swap image of unpopped zit with popped zit and then add class fadeOutDown