import * as helper from "./helper.js";

helper.initializeApp();


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


//will open a dialog if user wants to DELETE a note or VIEW a note
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
        document.getElementById("create-note-input" ).value = "";
        
        const dialog = button.getAttribute("dialog-id");
        helper.closeDialog(dialog);

        if(dialog === "create-note-dialog"){
            const duplicateNotesMessage = document.querySelector("#create-note-dialog .dialog-body div");

            if(duplicateNotesMessage != null) {
                duplicateNotesMessage.remove();

            }else {
                return;

            }
        }
    }
)
})


//event listener to delete the current note that the user has picked
document.getElementById("delete-note-button").addEventListener("click", async (e) => {

    //Get the data of the note from the current dialog that was opened
    let targetNote = document.getElementById("delete-note-button").getAttribute("data-type"); 


    try{
        await helper.deleteNote(encodeURIComponent(targetNote));
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
    //get the current text that was written in the dialog text input
    let input = helper.getTextElementInput("create-note-input");

    const doNotesExist = await helper.doNotesExist(); //true if note exists false if none

    //api call which returns true or fals for correct running
    let noteInputReturn = await helper.createNote(input);
    
    if(noteInputReturn === false) {//note name trying to be created already exists

        //show an error on the dialog by inserting an html element saying that this note already exists
        const noteExistsErrorMessage = document.querySelector("#create-note-dialog .dialog-body div");

        if(noteExistsErrorMessage === null) {
            let container = document.querySelector("#create-note-dialog .dialog-body");
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Note name already exists"

            container.appendChild(errorMessage);
            
        }else {
            
            return;
        }

    }else {//note created has a unique name

        if(!doNotesExist) {//no notes currently exist
            //close the dialog page
            helper.closeDialog("create-note-dialog");

            //clear the "No Notes" message from the notes sliding page
            const noNotesMessage = document.querySelector("#scrollable-note-names h1");
            noNotesMessage.remove()

            //render the list with the new note created
            let listOfNotes = await helper.returnAllNoteNames();
            helper.renderList(listOfNotes);

            //clear the text input
            document.getElementById("create-note-input" ).value = "";
 
        }else {//one or more notes exist
            
            helper.closeDialog("create-note-dialog");
            helper.clearNoteListUI();

            await helper.refreshNotesUI();

            //clear the text input
            document.getElementById("create-note-input" ).value = "";
        }

        //Remove the duplicate notes error message if it exists
        const duplicateNotesMessage = document.querySelector("#create-note-dialog .dialog-body div");

        if(duplicateNotesMessage != null) {
            duplicateNotesMessage.remove();
        }
    }

})