const MAX_GUESSES = 2;
const CARD_CSS_CLASS = "card";
const FLIPPED_CSS_CLASS = "flipped";
const BEST_SCORES_STORAGE_KEY = "BestScores";

const gameboard = document.getElementById("gameboard");
const guesses = [];
let bestScores = {};
let matchCount = 0;
let tryCount = 0;
let showingMismatchedCards = false;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while(counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function setupGameboard() {
  gameboard.addEventListener("click", onCardClick);
  const deckSize = document.getElementById('deck-size').value;
  const cards = document.getElementsByClassName(CARD_CSS_CLASS);
  addRemoveCards(cards, deckSize);
  assignCardColors(cards, generateRandomColors(deckSize));
}

function generateRandomColors(deckSize) {
  const colors = [];

  for(let i = deckSize; i > deckSize/MAX_GUESSES; i--) {
    let newColor = getRandomColor();
    for(let j = 0; j < MAX_GUESSES; j++)
      colors.push(newColor); // Insert the color as many times as required to make a match
  }

  return shuffle(colors);
}

function getRandomColor() {
  // Generate a random color from 4096 possible colors
  const r = Math.floor(Math.random() * 16);
  const g = Math.floor(Math.random() * 16);
  const b = Math.floor(Math.random() * 16);
  const hexR = r.toString(16);
  const hexG = g.toString(16);
  const hexB = b.toString(16);
  return `#${hexR}${hexG}${hexB}`;
}

function addRemoveCards(cards, deckSize) {
  // Create the cards on first load and making a bigger gameboard.
  while(cards.length < deckSize) {
    const card = document.createElement("div");
    const inner = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");
    card.classList.add("card");
    inner.classList.add("inner");
    front.classList.add("front");
    back.classList.add("back");
    inner.append(front);
    inner.append(back);
    card.append(inner);
    gameboard.append(card);
  }

  // Trim the gameboard if using a smaller card deck this time.
  while(cards.length > deckSize)
    cards[cards.length-1].remove();
}

function assignCardColors(cards, shuffledColors) {
  for(let i = 0; i < cards.length; i++) {
    hideCard(cards[i]); // When resetting for a new game
    setTimeout(function() { // Wait for the card to flip back over before assigning the color
      cards[i].dataset.color = shuffledColors[i];
      cards[i].querySelector(".front").style.backgroundColor = shuffledColors[i];
    }, 500);
  }
}

function resetGuesses() {
  while(guesses.length)
    guesses.pop();
}

function showCard(card) {
  card.classList.add(FLIPPED_CSS_CLASS);
}

function hideCard(card) {
  card.classList.remove(FLIPPED_CSS_CLASS);
}

function onCardClick(e) {
  const card = e.target.parentElement.parentElement; // .card => .inner => .back (e.target)

  if(showingMismatchedCards || !card || card.classList.contains(FLIPPED_CSS_CLASS) || !card.classList.contains(CARD_CSS_CLASS) || guesses.length > MAX_GUESSES)
    return; // Ignore clicks on already flipped cards or non-card elements

  // Any card flipped
  showCard(card);
  guesses.push(card);
  
  if(cheating && guesses.length < MAX_GUESSES)
    revealMatchingCard(card);

  // Last card flipped
  if(guesses.length === MAX_GUESSES){
    tryCount++;
    checkForMatchingCards();
    updateIndicators();
    isGameOver();
  }
}

function checkForMatchingCards() {
  if(guesses[0].dataset.color === guesses[1].dataset.color){
    resetGuesses();
    matchCount++;
  } else {
    // Show the cards for a short time then flip them back over
    showingMismatchedCards = true;
    
    setTimeout(function(){
      for(let guess of guesses) {
        hideCard(guess);
        showingMismatchedCards = false;
      }
      resetGuesses();
    }, 1000)
  }
}

function isGameOver() {
  const cards = document.getElementsByClassName(CARD_CSS_CLASS);
  const shown = document.getElementsByClassName(FLIPPED_CSS_CLASS);
  if(cards.length === shown.length) {
    document.getElementById("game-over").style.visibility = "visible";
    document.getElementById("start").innerText = "Play Again";
    updateIfNewRecord();
  }
}

function updateIndicators() {
  const percent = tryCount? Math.round(matchCount/tryCount*100) : 0; // Avoid divide by zero
  document.getElementById("matches").innerText = matchCount;
  document.getElementById("tries").innerText = tryCount;
  document.getElementById("score").innerText = percent;
}

function updateIfNewRecord() {
  const deckSize = document.getElementById('deck-size').value;
  const matchCount = parseInt(document.getElementById("matches").innerText);
  const tryCount = parseInt(document.getElementById("tries").innerText);
  const score = parseInt(document.getElementById("score").innerText);
  const equaledCheater = tryCount === bestScores[deckSize].tries && !cheating && bestScores[deckSize].cheated;
  
  // Update the best score
  if(tryCount < bestScores[deckSize].tries || equaledCheater || bestScores[deckSize].matches === 0){
    bestScores[deckSize].matches = matchCount;
    bestScores[deckSize].tries = tryCount;
    bestScores[deckSize].score = score;
    bestScores[deckSize].cheated = cheating;
    document.getElementById("new-record").style.visibility = "visible";
  }

  localStorage.setItem(BEST_SCORES_STORAGE_KEY, JSON.stringify(bestScores));
  updateBestScoreDisplay();
}

document.addEventListener("DOMContentLoaded", function(e){
  if(localStorage.getItem(BEST_SCORES_STORAGE_KEY))
    bestScores = JSON.parse(localStorage.getItem(BEST_SCORES_STORAGE_KEY));
  updateBestScoreDisplay();
});

document.getElementById("deck-size").addEventListener("change", function(e){
  updateBestScoreDisplay();
});

function updateBestScoreDisplay(){
  const deckSize = document.getElementById('deck-size').value;

  if(!bestScores[deckSize])
    bestScores[deckSize] = {matches: 0, tries: 0, score: 0};

  document.getElementById("best-deck").innerText = deckSize;
  document.getElementById("best-matches").innerText = bestScores[deckSize].matches;
  document.getElementById("best-tries").innerText = bestScores[deckSize].tries;
  document.getElementById("best-score").innerText = bestScores[deckSize].score;
  document.getElementById("best-cheater").style.display = bestScores[deckSize].cheated? "inline" : "none";
}

document.getElementById("start").addEventListener("click", function(e){
  setupGameboard();
  document.getElementById("game-stats").style.visibility = "visible";
  // Reuse the start button for a new game button
  e.target.innerText = "Start Over";
  // Reset for new game
  document.getElementById("game-over").style.visibility = "hidden";
  document.getElementById("new-record").style.visibility = "hidden";
  resetGuesses();
  matchCount = 0;
  tryCount = 0;
  updateIndicators();
});

const CHEAT_CODE = "xyzzy";
let cheating = false;

document.querySelector("h1").addEventListener("click", function(){
  const code = prompt("Enter cheat code");
  if(code === CHEAT_CODE){
    alert("Nothing happens... or so it seems.");
    cheating = true;
  }
});

function revealMatchingCard(card){
  for(let mate of document.querySelectorAll(`.card[data-color="${card.dataset.color}"]`)) {
    if(mate != card && !mate.classList.contains(FLIPPED_CSS_CLASS)){
      mate.style.boxShadow = "0 0 1rem " + card.dataset.color; // Cheater!
      setTimeout(function(){
        mate.style.boxShadow = "none";
      }, 1000);
    }
  }
}