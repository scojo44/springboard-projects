const {MarkovMachine} = require('./markov');

describe('MarkovMachine Tests', () => {
  const source = 'the cat in the hat is in the hat';
  let mm;

  beforeEach(() => {
    mm = new MarkovMachine(source);
  });

  test('if the constructor creates a chains object', () => {
    console.log("skirt", mm.chains);
    expect(mm.chains).toEqual({
      "the cat": ["in"],
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