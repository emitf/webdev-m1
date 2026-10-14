const creatures = [
  { emoji: '🐠', name: 'tropical fish' },
  { emoji: '🐙', name: 'octopus' },
  { emoji: '🐢', name: 'turtle' },
  { emoji: '🦀', name: 'crab' },
  { emoji: '🐬', name: 'dolphin' },
  { emoji: '🐳', name: 'whale' },
  { emoji: '🦈', name: 'shark' },
  { emoji: '🪼', name: 'jellyfish' },
  { emoji: '🐚', name: 'shell' },
  { emoji: '🦭', name: 'seal' },
];

const levels = [
  { rows: 3, columns: 4, pairs: 6 },
  { rows: 4, columns: 4, pairs: 8 },
  { rows: 4, columns: 5, pairs: 10 },
];

const board = document.querySelector('#board');
const cards = Array.from(document.querySelectorAll('.memory-card'));
const levelDisplay = document.querySelector('#level-number');
const moveDisplay = document.querySelector('#move-count');
const timerDisplay = document.querySelector('#timer');
const pairsDisplay = document.querySelector('#pairs-found');
const pairTotalDisplay = document.querySelector('#pair-total');
const messageDisplay = document.querySelector('#game-message');
const nameInput = document.querySelector('#player-name');
const leaderboardBody = document.querySelector('#leaderboard-list');
const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button');

let attempts = [];
let cardValues = [];
let currentLevel = 0;
let firstCard = null;
let secondCard = null;
let moveCount = 0;
let pairsFound = 0;
let elapsedSeconds = 0;
let boardLocked = false;
let gameState = 'ready';
let flipBackTimeout;
let timerId;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateTimer() {
  elapsedSeconds += 1;
  timerDisplay.textContent = formatTime(elapsedSeconds);
}

function startTimer() {
  window.clearInterval(timerId);
  elapsedSeconds = 0;
  timerDisplay.textContent = formatTime(elapsedSeconds);
  timerId = window.setInterval(updateTimer, 1000);
}

function saveAttempt() {
  let playerName = nameInput.value.trim();
  if (playerName === '') playerName = 'Ocean Explorer';

  const attempt = {
    name: playerName,
    levels: currentLevel + 1,
    moves: moveCount,
    time: elapsedSeconds,
  };

  attempts.push(attempt);
  showLeaderboard();
}

function showLeaderboard() {
  attempts.sort((firstAttempt, secondAttempt) => {
    if (firstAttempt.moves !== secondAttempt.moves) {
      return firstAttempt.moves - secondAttempt.moves;
    }
    return firstAttempt.time - secondAttempt.time;
  });

  leaderboardBody.textContent = '';
  attempts.forEach((attempt) => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const levelsCell = document.createElement('td');
    const movesCell = document.createElement('td');
    const timeCell = document.createElement('td');

    nameCell.textContent = attempt.name;
    levelsCell.textContent = `${attempt.levels} / ${levels.length}`;
    movesCell.textContent = String(attempt.moves);
    timeCell.textContent = formatTime(attempt.time);

    row.appendChild(nameCell);
    row.appendChild(levelsCell);
    row.appendChild(movesCell);
    row.appendChild(timeCell);
    leaderboardBody.appendChild(row);
  });
}

function shuffleCards(cardList) {
  for (let index = cardList.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temporaryCard = cardList[index];
    cardList[index] = cardList[randomIndex];
    cardList[randomIndex] = temporaryCard;
  }
}

function hideCard(card) {
  const cardIndex = Number(card.dataset.card);
  card.classList.remove('is-flipped');
  card.textContent = '≈';
  card.setAttribute('aria-label', `Card ${cardIndex + 1}, face down`);
}

function showCard(card) {
  const cardIndex = Number(card.dataset.card);
  const creature = cardValues[cardIndex];
  card.classList.add('is-flipped');
  card.textContent = creature.emoji;
  card.setAttribute('aria-label', `Card ${cardIndex + 1}, ${creature.name}`);
}

function handleCardClick(event) {
  const clickedCard = event.currentTarget;

  if (gameState !== 'playing' || boardLocked || clickedCard.classList.contains('is-flipped') || clickedCard.classList.contains('is-matched')) {
    return;
  }

  showCard(clickedCard);

  if (firstCard === null) {
    firstCard = clickedCard;
    return;
  }

  secondCard = clickedCard;
  moveCount += 1;
  moveDisplay.textContent = String(moveCount);
  checkForMatch();
}

function checkForMatch() {
  const firstIndex = Number(firstCard.dataset.card);
  const secondIndex = Number(secondCard.dataset.card);
  const firstCreature = cardValues[firstIndex];
  const secondCreature = cardValues[secondIndex];

  if (firstCreature.name === secondCreature.name) {
    firstCard.classList.add('is-matched');
    secondCard.classList.add('is-matched');
    firstCard.setAttribute('aria-label', `Matched ${firstCreature.name}`);
    secondCard.setAttribute('aria-label', `Matched ${secondCreature.name}`);
    pairsFound += 1;
    pairsDisplay.textContent = String(pairsFound);
    messageDisplay.textContent = 'Pair found! Keep going.';
    firstCard = null;
    secondCard = null;

    if (pairsFound === levels[currentLevel].pairs) {
      finishLevel();
    }
    return;
  }

  boardLocked = true;
  messageDisplay.textContent = 'Not a match. Take another look!';
  flipBackTimeout = window.setTimeout(() => {
    hideCard(firstCard);
    hideCard(secondCard);
    firstCard = null;
    secondCard = null;
    boardLocked = false;
    messageDisplay.textContent = `Find all ${levels[currentLevel].pairs} pairs to complete this level.`;
  }, 850);
}

function startLevel() {
  const level = levels[currentLevel];
  cardValues = [];
  for (let index = 0; index < level.pairs; index += 1) {
    cardValues.push(creatures[index], creatures[index]);
  }
  shuffleCards(cardValues);

  firstCard = null;
  secondCard = null;
  pairsFound = 0;
  boardLocked = false;
  gameState = 'playing';

  board.classList.toggle('has-five-columns', level.columns === 5);
  board.setAttribute('aria-label', `Level ${currentLevel + 1}, ${level.rows} rows by ${level.columns} columns`);
  cards.forEach((card, index) => {
    card.hidden = index >= cardValues.length;
    card.disabled = card.hidden;
    card.classList.remove('is-flipped', 'is-matched');
    hideCard(card);
  });

  levelDisplay.textContent = String(currentLevel + 1);
  pairsDisplay.textContent = '0';
  pairTotalDisplay.textContent = String(level.pairs);
  messageDisplay.textContent = `Find all ${level.pairs} pairs to complete this level.`;
  startButton.disabled = true;
  restartButton.disabled = false;
}

function finishLevel() {
  boardLocked = true;
  cards.forEach((card) => {
    card.disabled = true;
  });
  const isFinalLevel = currentLevel === levels.length - 1;

  if (isFinalLevel) {
    window.clearInterval(timerId);
    gameState = 'finished';
    messageDisplay.textContent = `You completed all three levels in ${moveCount} moves!`;
    saveAttempt();
    startButton.textContent = 'Play Again';
    restartButton.disabled = true;
    startButton.disabled = false;
    return;
  }

  gameState = 'level-complete';
  messageDisplay.textContent = `Level ${currentLevel + 1} complete! Your total is ${moveCount} moves.`;
  startButton.textContent = 'Next Level';
  startButton.disabled = false;
}

function startGame() {
  window.clearTimeout(flipBackTimeout);
  currentLevel = 0;
  moveCount = 0;
  moveDisplay.textContent = '0';
  startButton.textContent = 'Start Game';
  startTimer();
  startLevel();
}

function startNextLevel() {
  currentLevel += 1;
  startButton.textContent = 'Next Level';
  startLevel();
}

function handleStartButtonClick() {
  if (gameState === 'level-complete') {
    startNextLevel();
  } else {
    startGame();
  }
}

cards.forEach((card) => {
  card.addEventListener('click', handleCardClick);
});
startButton.addEventListener('click', handleStartButtonClick);
restartButton.addEventListener('click', startGame);
