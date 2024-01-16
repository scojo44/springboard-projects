const {MarkovMachine} = require('./markov');

describe('MarkovMachine Tests', () => {
  const source = 'the cat in the hat';
  let mm;

  beforeEach(() => {
    mm = new MarkovMachine(source);
  });

  test('if the constructor creates a chains object', () => {
    expect(mm.chains).toEqual({
      the: ["cat", "hat"],
      cat: ["in"],
      in: ["the"],
      hat: [null]
    });
  });

  test('if the result only uses words from the original text', () => {
    const words = mm.makeText().split(/\s/);
    for(let w of words)
      expect(source).toContain(w);
  })
})