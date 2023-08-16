const gameboard = document.getElementById("gameboard");
const MAX_GUESSES = 2;
// CSS class names
const CARD = "card";
const FLIPPED = "flipped";

const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple"
];

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

  const cards = document.getElementsByClassName(CARD);
  const shuffledColors = shuffle(COLORS);

  // Create the card divs on first load.
  if(!cards.length)
    for(let color of shuffledColors) { // Use color array to figure out how many cards to make
      const newCard = document.createElement("div");
      newCard.classList.add("card");
      gameboard.append(newCard);
    }

  // Assign random colors
  for(let i = 0; i < cards.length; i++) {
    cards[i].classList.remove(FLIPPED); // When resetting for a new game
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

function onCardClick(e) {
  if(showingMismatchedCards ||
     e.target.classList.contains(FLIPPED) ||
     !e.target.classList.contains(CARD)){
       return; // Ignore clicks on already flipped cards or non-card elements
    }

  if(guesses.length < MAX_GUESSES){
    e.target.classList.add(FLIPPED);
    guesses.push(e.target);

    if(cheating && guesses.length < MAX_GUESSES){
      for(let card of document.getElementsByClassName(e.target.dataset.color)){
        if(card != e.target && !card.classList.contains(FLIPPED)){
          card.style.borderColor = e.target.dataset.color; // Cheater!
          setTimeout(function(){
            card.style.borderColor = "black";
          }, 1000);
        }
      }
    }

    if(cheating){
      for(let card of document.getElementsByClassName(e.target.dataset.color)){
        if(card != e.target)
          card.style.borderColor = e.target.dataset.color;
      }
    }
  }

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
          card.classList.remove(FLIPPED);
          showingMismatchedCards = false;
        }
        resetGuesses();
      }, 1000)
    }

    tryCount++;
    updateIndicators();
  }
}

const CHEAT_CODE = "xyzzy";
let cheating = false;

function isGameOver(){
  const cards = document.getElementsByClassName(CARD);
  const shown = document.getElementsByClassName(FLIPPED);
  if(cards.length === shown.length) {
    document.getElementById("game-over").style.display = "block";
  }
}

let matchCount = 0
let tryCount = 0;

function updateIndicators(){
  document.getElementById("matches").innerText = matchCount;
  document.getElementById("tries").innerText = tryCount;
  if(tryCount > 0)
    document.getElementById("score").innerText = Math.round(matchCount/tryCount*100) + "%";
}

document.getElementById("start").addEventListener("click", function(e){
  e.target.remove();
  setupGameboard();
  document.getElementById("game").style.display = "block";
});

document.getElementById("new-game").addEventListener("click", function(e){
  setupGameboard(); // Flip all the cards back over and shuffle them
  e.target.style.display = "none";
  matchCount = 0;
  tryCount = 0;
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

document.querySelector("h1").addEventListener("click", function(){
  const code = prompt("Enter cheat code");
  if(code === CHEAT_CODE){
    alert("Nothing happens... or so it seems.");
    cheating = true;
  }
});
