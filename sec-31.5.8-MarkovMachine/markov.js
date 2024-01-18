/** Textual markov chain generator */

class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    this.words = text.split(/[ \r\n]+/).filter(w => w !== "");
    const startIndex = this.selectStartIndex();
    this.firstBigram = this.words[startIndex] + " " + this.words[startIndex+1];
    this.makeChains();
  }

  selectStartIndex() {
    // Collect the indexes of all the capitalize words and randomly pick one to start with
    const startWords = this.words
      .map((w,i) => ({word: w, index: i}))
      .filter((w,i) => i === 0 || this.words[w.index-1].endsWith("."));
    return startWords[this.getRandomIndex(startWords.length)].index;
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    this.chains = {};

    this.words.forEach((w,i) => {
      const nextWord = this.words[i+2] || null;

      if(!this.words[i+1]) // Stop if on the last word
        return;

      const bigram = w + " " + this.words[i+1];

      if(!this.chains[bigram])
        this.chains[bigram] = [];

      if(!this.chains[bigram].includes(nextWord)) // Avoid duplicates
        this.chains[bigram].push(nextWord);
    });
  }

  /** return random text from chains */

  makeText(numWords = 100) {
    // Initialize the text with the randomly chosen first word.
    const text = [];
    let currentBigram = this.firstBigram;
    let previousWord = this.firstBigram.split(" ")[1];
    text.push(currentBigram);

    // Loop through the word chains and randomly choose a next word.
    while(currentBigram && numWords > 0) {
      const nextWordIndex = this.getRandomIndex(this.chains[currentBigram].length);
      const nextWord = this.chains[currentBigram][nextWordIndex];

      if(!nextWord)
        break;

      // console.log(numWords, "P:", previousWord, "N:", nextWord, "CB:", currentBigram, this.chains[currentBigram], nextWordIndex, ":", this.chains[currentBigram][nextWordIndex])
      currentBigram = previousWord + " " + nextWord;
      text.push(nextWord);
      previousWord = nextWord;
      numWords--;
    }

    return text.join(" ");
  }

  /** checks for a capitalized word */

  isCapitalized(word){
    return "A" <= word[0] && word[0] <= "Z";
  }
  /** get a random index */
  getRandomIndex(max) {
    return Math.floor(Math.random() * max);
  }
}

module.exports = {
  MarkovMachine: MarkovMachine
}