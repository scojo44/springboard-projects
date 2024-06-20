function addItem(item, checked){
    const theList = document.querySelector("#checklist");
    const newEntry = document.createElement('li');
    newEntry.classList.add("entry");
    newEntry.dataset.item = item;
    if(checked)
        toggleItem(newEntry);
    newEntry.innerText = item;

    // Setup the delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerText = "X";

    newEntry.append(deleteButton);
    theList.append(newEntry);
}

function toggleItem(entry){
    entry.classList.toggle("checked");
    entry.dataset.checked = entry.classList.contains("checked");
}

function save(){
    const list = [];
    for(let entry of document.querySelectorAll(".entry")){
        list.push(entry.dataset);
    }

    localStorage.setItem("theList", JSON.stringify(list));
}

document.addEventListener("DOMContentLoaded", function(){
    const theList = JSON.parse(localStorage.getItem("theList"));
    console.log(theList);
    for(let entry of theList){
        addItem(entry.item, entry.checked === "true");
    }
});

document.querySelector('#new-entry').addEventListener("submit", function(e){
    e.preventDefault();
    const newItem = document.querySelector("#new-item");
    addItem(newItem.value);
    newItem.value = "";
    save();
});

document.querySelector('#checklist').addEventListener("click", function(e){
    console.log(e.target);
    switch(e.target.tagName){
        case "BUTTON":
            e.target.parentElement.remove();
            break;
        case "LI":
            toggleItem(e.target);
            break;
    }
    save();
});
