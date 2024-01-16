/** Command-line tool to generate Markov text. */
const fs = require('fs');
const axios = require('axios');
const {MarkovMachine} = require('./markov');

switch(process.argv[2]) {
  case 'file':
    getFromFile(process.argv[3]);
    break;

  case 'url':
    getFromURL(process.argv[3]);
    break;

  default:
    handleError("Invalid source type.  Only 'file' and 'url' are accepted.");
    break;
}

function getFromFile(path) {
  fs.readFile(path, "utf8", (error, data) => {
    if(error)
      handleError("Error reading file:", error);

    processOutput(data);
  });
}

async function getFromURL(url) {
  try{
    res = await axios.get(url);
  }
  catch(error) {
    handleError("Error getting page:", error);
  }

  processOutput(res.data);
}

function processOutput(text) {
  const mm = new MarkovMachine(text);
  console.log(mm.makeText());
}

function handleError(msg, error) {
  console.error(msg, error?.message || "");
  process.exit(1);
}