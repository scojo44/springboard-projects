const gameboard = document.getElementById("gameboard");
const MAX_GUESSES = 2;
// CSS class names
const CARD = "card";
const FLIPPED = "flipped";

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

function getRandomColor(){
  // Generate a random color from 4096 possible colors
  const r = Math.floor(Math.random() * 16);
  const g = Math.floor(Math.random() * 16);
  const b = Math.floor(Math.random() * 16);
  const hexR = r.toString(16);
  const hexG = g.toString(16);
  const hexB = b.toString(16);
  return `#${hexR}${hexG}${hexB}`;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function setupGameboard() {
  gameboard.addEventListener("click", onCardClick);
  const cardCount = document.getElementById('deck-size').value;
  const colors = [];

  // Generate enough random colors for the number of cards
  for(let i = cardCount; i > cardCount/MAX_GUESSES; i--){
    let newColor = getRandomColor();
    for(let j = 0; j < MAX_GUESSES; j++)
      colors.push(newColor); // Insert the color as many times as required to make a match
  }

  const cards = document.getElementsByClassName(CARD);
  const shuffledColors = shuffle(colors);

  // Trim the gameboard if using a smaller card deck this time.
  while(cards.length > colors.length){
    cards[cards.length-1].remove();
  }

  // Create the card divs on first load and making a bigger gameboard.
  while(cards.length < colors.length) { // Use color array to figure out how many cards to make
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    gameboard.append(newCard);
  }

  // Assign random colors
  for(let i = 0; i < cards.length; i++) {
    hideCard(cards[i]); // When resetting for a new game
    cards[i].classList.add(shuffledColors[i]);
    cards[i].dataset.color = shuffledColors[i];
  }
}

let guesses = [];
let showingMismatchedCards = false;

function resetGuesses(){
  while(guesses.length)
    guesses.pop();
}

function showCard(card){
  card.classList.add(FLIPPED);
  card.style.backgroundColor = card.dataset.color;
}

function hideCard(card){
  card.classList.remove(FLIPPED);
  card.style.backgroundColor = "";
}

function onCardClick(e) {
  if(showingMismatchedCards || e.target.classList.contains(FLIPPED) || !e.target.classList.contains(CARD))
    return; // Ignore clicks on already flipped cards or non-card elements

  // Any card flipped
  if(guesses.length < MAX_GUESSES){
    showCard(e.target);
    guesses.push(e.target);

    if(cheating && guesses.length < MAX_GUESSES){
      for(let card of document.getElementsByClassName(e.target.dataset.color)){
        if(card != e.target && !card.classList.contains(FLIPPED)){
          card.style.boxShadow = "0 0 1rem " + e.target.dataset.color; // Cheater!
          setTimeout(function(){
            card.style.boxShadow = "none";
          }, 1000);
        }
      }
    }
  }

  // Last card flipped
  if(guesses.length >= MAX_GUESSES) {
    // Check for matching colors
    const match = guesses[0].dataset.color === guesses[1].dataset.color;

    if(match){
      resetGuesses();
      // Update match count
      matchCount++;
      isGameOver();
    } else {
      showingMismatchedCards = true;
      // Flip cards back over
      setTimeout(function(){
        for(let card of guesses) {
          hideCard(card);
          showingMismatchedCards = false;
        }
        resetGuesses();
      }, 1000)
    }

    tryCount++;
    updateIndicators();
  }
}

function isGameOver(){
  const cards = document.getElementsByClassName(CARD);
  const shown = document.getElementsByClassName(FLIPPED);
  if(cards.length === shown.length) {
    document.getElementById("game-over").style.visibility = "visible";
    document.getElementById("start").innerText = "Play Again";
  }
}

let matchCount = 0
let tryCount = 0;

function updateIndicators() {
  const percent = tryCount? Math.round(matchCount/tryCount*100) : 0; // Avoid divide by zero
  document.getElementById("matches").innerText = matchCount;
  document.getElementById("tries").innerText = tryCount;
  document.getElementById("score").innerText = percent + "%";
}

document.getElementById("start").addEventListener("click", function(e){
  setupGameboard();
  document.getElementById("game").style.visibility = "visible";
  // Reuse the start button for a new game button
  e.target.innerText = "Start Over";
  // Reset for new game
  document.getElementById("game-over").style.visibility = "hidden";
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
