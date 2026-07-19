import * as helper from "./helper.js";

helper.initializeApp();

document.getElementById("search-bar").addEventListener("input", async (e) => {
    //store the notes grabbed from the api call
    let noteNames = await helper.returnAllNoteNames();
    
    let results = helper.fuzzySearchResult(e.target.value, noteNames);

    //no result after search
    if(results.length === 0){
        helper.clearNoteListUI();

        const noResultElement = document.createElement("h2");
        noResultElement.id = "no-matching-results";

        const nameNode = document.createTextNode("No matching results");

        noResultElement.appendChild(nameNode);
        document.getElementById("scrollable-note-names").appendChild(noResultElement);

    }else{
        helper.clearNoteListUI();
        helper.renderList(results);
    }
})  

document.getElementById("scrollable-note-names").addEventListener("click", (e) => {
    let buttonType = e.target.getAttribute("class");

    if(buttonType === "note-button") {
        console.log("The note button was pressed");
    }else {
        console.log("The delete note button was pressed");
    }
})