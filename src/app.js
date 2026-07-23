import * as helper from "./helper.js";

helper.initializeApp();

//Listener that reads the search bar input and then prints the notes that are closest to that note searched
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

//will open a dialog if user wants to delete a note
document.getElementById("scrollable-note-names").addEventListener("click", (e) => {
    let buttonPressed = e.target.closest("button");
    // console.log(buttonPressed);

    if(buttonPressed.getAttribute("class") === "note-button") {
        //future code which will open the notes text
    }else if(buttonPressed.getAttribute("class") === "delete-note-button"){
        //open the dialog to delete a note

        //change attributes of the dialog to store the target note for deletion
        helper.changeDeleteNoteDialogAttribute(buttonPressed.getAttribute("target-note"));
        helper.showDeleteNoteDialog();
    }
})

document.querySelectorAll(".close-delete-dialog").forEach((button) => {
    button.addEventListener("click", (e) => {
        helper.closeDeleteNoteDialog();
    })
})