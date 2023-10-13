const fruitNames = ['Apple', 'Apricot', 'Avocado 🥑', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant',
  'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Coconut', 'Cranberry', 'Cucumber', 'Custard apple',
  'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Gooseberry', 'Grape',
  'Raisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul',
  'Juniper berry', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango',
  'Mangosteen', 'Marionberry', 'Melon', 'Cantaloupe', 'Honeydew', 'Watermelon', 'Miracle fruit',
  'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine',
  'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Plantain', 'Plum', 'Pineapple',
  'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant',
  'Salak', 'Satsuma', 'Soursop', 'Star fruit', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];

const input = document.querySelector('#fruit');
const suggestions = document.querySelector('#suggestions menu');
  
function whileTypingQuery(e) {
  clearSuggestions();
  if(!input.value) return; // Don't show the entire list when the search bar is empty
  showSuggestions(input.value);
}

function search(str) {
  return fruitNames.filter(word => word.toLowerCase().includes(str.toLowerCase()));
}
function showSuggestions(query) {
  for(let fruit of search(query)){
    const item = document.createElement("li");
    // Add suggestion with search string highlighted
    item.innerHTML = fruit.replace(new RegExp(query, "gi"), '<span class="highlight">$&</span>');
    suggestions.append(item);
    suggestions.classList.add("has-suggestions");
  }
}

function useSuggestion(e) {
  if(e.target.tagName === "LI"){
    input.value = e.target.innerText;
    input.focus();
    clearSuggestions();
  }
}

function clearSuggestions(){
  suggestions.innerHTML = "";
  suggestions.classList.remove("has-suggestions");
}

input.addEventListener('keyup', whileTypingQuery);
suggestions.addEventListener('click', useSuggestion);