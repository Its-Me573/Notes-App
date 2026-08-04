import * as helper from "./helper.js";

helper.initializeApp();

helper.createNote();

// helper.showDialog("create-note-dialog");

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

    //prevent user from clicking in the container
    if(buttonPressed === null){
        return;
    }

    if(buttonPressed.getAttribute("class") === "note-button") {
        //future code which will open the notes text
    }else if(buttonPressed.getAttribute("class") === "delete-note-button"){

        //change attributes of the dialog to store the target note for deletion
        helper.modifyElementAttribute("delete-note-button",
                                      "data-type",
                                      buttonPressed.getAttribute("target-note") )
        //open dialog
        helper.showDialog("delete-note-dialog");
    
    }
})

//listeners for all buttons in the close-dialog class to close respective dialog pop-up
document.querySelectorAll(".close-dialog").forEach((button) => {
    button.addEventListener("click", (e) => {
        helper.closeDialog(button.getAttribute("dialog-id"));
    })
})

//event listener to delete the current note that the user has picked
document.getElementById("delete-note-button").addEventListener("click", async (e) => {
    let targetNote = document.getElementById("delete-note-button").getAttribute("data-type"); 

    try{
        await helper.deleteNote(targetNote);

        helper.closeDialog("delete-note-dialog");
        helper.clearNoteListUI();

        await helper.refreshNotesUI();
    }catch(error) {
        console.error(error.message);
    }
})


