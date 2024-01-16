/** Textual markov chain generator */

class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    const words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.firstWord = this.words[this.getRandomIndex(this.words.length)];
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    this.chains = {};

    this.words.forEach((w,i) => {
      const nextWord = this.words[i+1] || null;

      if(!this.chains[w])
        this.chains[w] = [];

      if(!this.chains[w].includes(nextWord))
        this.chains[w].push(nextWord);
    });
  }

  /** return random text from chains */

  makeText(numWords = 100) {
    // Initialize the text with the randomly chosen first word.
    const text = [];
    let currentWord = this.firstWord;
    text.push(currentWord);

    // Loop through the word chains and randomly choose a next word.
    while(currentWord && numWords > 0) {
      const nextWordIndex = this.getRandomIndex(this.chains[currentWord].length);
      console.log(numWords, currentWord, this.chains[currentWord], nextWordIndex, ":", this.chains[currentWord][nextWordIndex])
      currentWord = this.chains[currentWord][nextWordIndex];
      text.push(currentWord);
      numWords--;
    }

    return text.join(" ");
  }

  /** get a random index */
  getRandomIndex(max) {
    return Math.floor(Math.random() * max);
  }
}

module.exports = {
  MarkovMachine: MarkovMachine
}