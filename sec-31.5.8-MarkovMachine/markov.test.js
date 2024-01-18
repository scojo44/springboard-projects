const {MarkovMachine} = require('./markov');

describe('MarkovMachine Tests', () => {
  const source = 'The cat in the hat is in the hat';
  let mm;

  beforeEach(() => {
    mm = new MarkovMachine(source);
  });

  test('if the constructor creates a chains object', () => {
    expect(mm.chains).toEqual({
      "The cat": ["in"],
      "cat in": ["the"],
      "in the": ["hat"],
      "the hat": ["is", null],
      "hat is": ["in"],
      "is in": ["the"]
    });
  });

  test('if the result only uses words from the original text', () => {
    const words = mm.makeText().split(/\s/);
    for(let w of words)
      expect(source).toContain(w);
  })
})