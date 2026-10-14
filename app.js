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
  { emoji: '🦑', name: 'squid' },
  { emoji: '🪸', name: 'coral' },
];

const PAIRS_IN_LEVEL = 6;
const cards = Array.from(document.querySelectorAll('.memory-card'));
const board = document.querySelector('#board');
const moveDisplay = document.querySelector('#move-count');
const pairsDisplay = document.querySelector('#pairs-found');
const messageDisplay = document.querySelector('#game-message');
const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button');

let cardValues = [];
let firstCard = null;
let secondCard = null;
let moveCount = 0;
let pairsFound = 0;
let boardLocked = false;
let flipBackTimeout;

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

  if (boardLocked || clickedCard.classList.contains('is-flipped') || clickedCard.classList.contains('is-matched')) {
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

    if (pairsFound === PAIRS_IN_LEVEL) {
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
    messageDisplay.textContent = 'Find all six pairs to complete this level.';
  }, 850);
}

function finishLevel() {
  boardLocked = true;
  messageDisplay.textContent = `Level complete! You found all ${PAIRS_IN_LEVEL} pairs in ${moveCount} moves.`;
  startButton.textContent = 'Play Again';
  startButton.disabled = false;
  restartButton.disabled = true;
}

function startGame() {
  window.clearTimeout(flipBackTimeout);
  cardValues = [];
  for (let index = 0; index < PAIRS_IN_LEVEL; index += 1) {
    cardValues.push(creatures[index], creatures[index]);
  }
  shuffleCards(cardValues);
  firstCard = null;
  secondCard = null;
  moveCount = 0;
  pairsFound = 0;
  boardLocked = false;

  cards.forEach((card) => {
    card.classList.remove('is-flipped', 'is-matched');
    hideCard(card);
  });

  moveDisplay.textContent = '0';
  pairsDisplay.textContent = '0';
  messageDisplay.textContent = 'Find all six pairs to complete this level.';
  startButton.disabled = true;
  restartButton.disabled = false;
  board.setAttribute('aria-label', 'Memory cards, level 1');
}

cards.forEach((card) => {
  card.addEventListener('click', handleCardClick);
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
