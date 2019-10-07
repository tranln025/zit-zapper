# Zit Zapper

## Play me:
https://pages.git.generalassemb.ly/ltran/zit-zapper/

## Why, oh why did you make this game?
When life gets stressful, it manifests in the form of unsightly zits. There are few pleasures in life as simple and as satisfying as squeezing the ever-loving heck out of a ripe zit to purge your skin of toxins and misery. Of course, popping your pimples is a huge no no, so I've created a virtual alternative! Pop to your heart's content without the swelling or scarring of zapping zits irl. Please enjoy!

## Wireframe
![wireframe](https://i.imgur.com/sviGJTd.png)

## User Stories
1. Upon page load, animate game title and pop up Instructions box
2. When user clicks start, minimize instructions, begin countdown timer, and spawn zits at random times in random locations in the game screen
3. User navigates using the arrow keys and pops zits by hitting spacebar
4. With each pop, show how many points the user earned based on reaction time and update the score
5. The full game is 30 seconds. Every 10 seconds, the zit spawn speed increases
6. After 30 seconds, stop timer and stop spawning zits. Pop up Game Over box shows the user's final score and top three player names and scores in leaderboard. Play Again button is at the bottom.
7. When user clicks Play Again, timer restarts, score is reset, and zits respawn

## Technologies Used
HTML, CSS, Javascript, jQuery, JSON, 
Animations from animate.css

## Approach Taken
I started with the game title at the top, with a canvas for game play beneath it, and a sticky footer at the bottom. At the top of the canvas was a rectangle that held the timer and score. Within the gameplay div, I layered a div for instructions on top of that, with a button to begin playing. I was able to update the timer every second on the canvas. I then attempted to generate a zit that I drew into the canvas and it was too difficult to constantly add and remove zits from the canvas. I figured it would be much easier to append and remove images from a div, so I scrapped the canvas and recreated the game screen as a div. Turns out I didn't need the canvas at all. 

I looked up functions to generate a zit in a random area of the div without overstepping the div at the top that held the timer and score. Then created a function to spawn zits at various time intervals. Next, I used an event listener so that on click, the zit would pop by changing images and fading out. With each click to pop, the score was also updated. I made up a points system to award points ranging from 1 to 5 depending on the time elapsed between the zit appearing and being clicked.

Because clicking to pop was too easy, I made the game more challenging by adding some custom drawn fingers, which navigated around the game play screen with the arrow keys and came together when the spacebar was pressed. For this, I had to figure out how the zits would pop. I used the coordinates of the center of the fingers image to determine when they were within the boundaries of a zit, and when the spacebar was pressed, the image would then change and points updated.

At the end of the game, I wanted to display a leaderboard of the top 3 players and their scores. At first, I stored player names (from input) and scores as objects in an array, sorted the array, and then displayed the first 3 objects as the leaderboard. But later on, I wanted the scores to be kept in local storage, so the leaderboard had to be turned into an object. I used JSON to convert values to strings to be stored locally and get called up each time the leaderboard was displayed.

I also ended up increasing the speed of the zit spawning every 10 seconds, with a round counter updating each time along with an animation.

Small adjustments were made to the styling of the game throughout the coding of JS.
