# Deep Sea Memory
## Mission M1 · The Awakening of the DOM - Web Development I

## How to use it
Open it by opening index.html in your browser or with a Live Server

  1. Enter your name and click the "Start Game" button
  2. Flip two cards at a time to find a matching pair. Each pair you flip counts as one move
  3. Find every pair and complete every level in the shortest amount of moves and time possible
  4. You will see a record of your attempts ranked in the leaderboard (attempts are ranked by fewest moves, then shortest time)
  6. Click the "Play again" button to start a new attempt or the "Reset" button to 
  reset the current attempt and start from scratch again

(The leaderboard is stored only while the page is open. Reloading the page clears it)

### Use of AI
I used OpenAI Codex as a programming partner, and worked on the game phase by phase. I asked for help planning the phases in
which to build the project, adding a feature or a few features at a time. I asked follow-up questions whenever something
was unclear. I also verified the code worked correctly after each change, making sure to test everything before commiting 
and moving on to the next stage. 

### Autopsy
  1. I decided to create the cards dynamically with JavaScript. At first I had the cards hardcoded in the HTML, and was hiding the ones which were not needed. But then I realized that this was too repetitive, and that if I wanted to make more levels or change the amount of pairs, it would require editing the HTML too. Now, the code creates the number of cards each level needs.
  2. I considered using localStorage so that the leaderboard would still appear after reloading the page. However, I decided to keep the leaderboard attempts only while the page is open because I thought that saving them was not necessary for this exercise. This also lets people have a small competition and quickly reset the leaderboard by reloading the page.
