/** Command-line tool to generate Markov text. */
const fs = require('fs').promises;
const axios = require('axios');
const {MarkovMachine} = require('./markov');
const striptags = require('striptags');

main();

async function main(){
  let text = "";

  if(!process.argv[3])
    handleError("Error:  Nothing to work with.");

  // Choose get function by type parameter
  switch(process.argv[2]) {
    case 'file':  text = await getData(getFromFile);  break;
    case 'url':   text = await getData(getFromURL);   break;
    case 'text':  text = process.argv[3];             break;
    default:
      handleError("Invalid source.  Only 'file,'  'url' and 'text' are accepted.");
      break;
  }

  // Generate realistic-looking word salad
  const mm = new MarkovMachine(text);
  console.log(mm.makeText());
}

// Use chosen get function to get the text data
async function getData(getFunc) {
  let argIndex = 3;
  let data = "";

  while(process.argv[argIndex]) {
    data += '\n' + await getFunc(process.argv[argIndex]);
    argIndex++;
  }

  return data;
}

/** Get text from a file */
async function getFromFile(path) {
  try {
    data = await fs.readFile(path, "utf8")
    return data;
  }
  catch(error) {
    handleError("Error reading file:", error);
  }
}

/** Fetch text from a URL */
async function getFromURL(url) {
  try {
    const {data} = await axios.get(url);
    return striptags(data);
  }
  catch(error) {
    handleError("Error getting page:", error);
  }
}

function handleError(msg, error) {
  console.error(msg, error?.message || "");
  process.exit(1);
}