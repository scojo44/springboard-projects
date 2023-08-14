const gameboard = document.getElementById("gameboard");
const MAX_GUESSES = 2;
// CSS class names
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

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for(let color of colorArray) {
    const newCard = document.createElement("div");
    newCard.classList.add(color);
    newCard.dataset.color = color;
    newCard.addEventListener("click", handleCardClick);
    gameboard.append(newCard);
  }
}

let guesses = [];
let showingMismatchedCards = false;

function resetGuesses(){
  while(guesses.length)
    guesses.pop();
}

function handleCardClick(event) {
  if(showingMismatchedCards || event.target.classList.contains(FLIPPED))
    return; // Ignore clicks on already flipped cards

  if(guesses.length < MAX_GUESSES){
    event.target.classList.add(FLIPPED);
    guesses.push(event.target);
  }

  if(guesses.length >= MAX_GUESSES) {
    // Check for matching colors
    const match = guesses[0].dataset.color === guesses[1].dataset.color;

    if(match){
      resetGuesses();
      // TODO: Update score
      document.getElementById("matches").innerText
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
  }
}

document.getElementById("start").addEventListener("click", function(e){
  createDivsForColors(shuffledColors);
  e.target.remove();
  document.getElementById("game").style.display = "block";
});