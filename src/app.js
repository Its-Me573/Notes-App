import * as helper from "./helper.js";

helper.initializeApp();

// helper.showDialog("create-note-dialog");


//prevent dialogs from being closed with "Esc"
document.querySelectorAll(".dialog-popup").forEach((dialog) => {
    dialog.addEventListener("keydown", (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
        }
    })
})


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
        const dialog = button.getAttribute("dialog-id");
        helper.closeDialog(dialog);

        if(dialog === "create-note-dialog"){
            document.getElementById("create-note-input" ).value = "";
            const duplicateNoteMessage = document.querySelector("#create-note-dialog .dialog-body div");
            duplicateNoteMessage.remove();
        }
    }
)
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


//listener to show create-note dialog
document.getElementById("add-note-button").addEventListener("click", () => {
    helper.showDialog("create-note-dialog");
})


//event listener to create new note
document.getElementById("create-note-button").addEventListener("click", async (e) => {
    //get the current text that was written in the input
    let input = helper.getTextElementInput("create-note-input");

    let noteInputReturn = await helper.createNote(input);
    
    if(noteInputReturn === false) {
        //show an error on the dialog by inserting an html element saying that this note already exists
        const dialog = document.getElementById("create-note-input");


    }else {
        helper.closeDialog("create-note-dialog");
        helper.clearNoteListUI();
        await helper.refreshNotesUI();
        document.getElementById("create-note-input" ).value = "";
        const duplicateNoteMessage = document.querySelector("#create-note-dialog .dialog-body div");
        duplicateNoteMessage.remove();
    }

})