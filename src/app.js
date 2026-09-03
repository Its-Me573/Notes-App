import * as helper from "./helper.js";

//Note text editor
const quill = new Quill('#editor', {
  modules: {
    history: {
      delay: 1000,
      maxStack: 500,
      userOnly: true
    },
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
    ],
  },
  placeholder: 'Create your note...',
  theme: 'snow', // or 'bubble'
});


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
document.getElementById("scrollable-note-names").addEventListener("click", async (e) => {
    const buttonPressed = e.target.closest("button");

    //prevent user from clicking in the container
    if(buttonPressed === null){
        return;
    }

    
    if(buttonPressed.getAttribute("class") === "note-button") {
        //When a note name button is pressed, that notes name will be put into session storage
        const currentNoteSelectedName = buttonPressed.getAttribute("note");
        //console.log(currentNoteSelectedName);

        //store the current note in session storage
        sessionStorage.setItem("currentNoteViewingName", currentNoteSelectedName);

        //after session storage is set, the value of that note has to be grabbed and sent to the text editor
        const renameInput = document.getElementById("rename-note-input");
        renameInput.value = sessionStorage.getItem("currentNoteViewingName");

        //show contents of the current note in the editor
        const targetNoteContent = await helper.getNote(currentNoteSelectedName);
        const delta = JSON.parse(targetNoteContent.content);
        
        quill.setContents(delta);

        //console.log(delta);

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


document.getElementById("rename-note-input").addEventListener("focusout", async (e) => {
    //rename note input
    const newNameInput = e.target.value;

    //modal popups
    const emptyNoteNameDialog = document.getElementById("rename-note-empty-dialog");
    const duplicateNoteNameDialog = document.getElementById("rename-note-duplicate-dialog")
    
    //current name is nothing, no changes are made, a name is required
    if(newNameInput.length == 0) {
        emptyNoteNameDialog.showModal();
        return;
    }

    //The rename is the same as what was before, no changes are made
    if(newNameInput == sessionStorage.getItem("currentNoteViewingName")) {
        return;
    }

    //The name is a duplicate and the current name already exists, either true or false
    const didRenameNoteWork = await helper.renameNote(sessionStorage.getItem("currentNoteViewingName"), newNameInput);
    
    //change the current note name in session storage, refresh the ui
    if(didRenameNoteWork) {        
        sessionStorage.setItem("currentNoteViewingName", newNameInput)
        helper.clearNoteListUI();
        helper.refreshNotesUI();
    }else {
        duplicateNoteNameDialog.showModal();

        const renameInput = document.getElementById("rename-note-input");
        renameInput.value = sessionStorage.getItem("currentNoteViewingName");
    }
})


//write event listener that looks at the quilljs text input, debounces
let timer;

quill.on('text-change', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {

        const delta = quill.getContents();
        const jsonDelta = JSON.stringify(delta);

        //send the jsonDelta to the api
        helper.modifyNoteContent(sessionStorage.getItem("currentNoteViewingName"), jsonDelta);

    }, 300);
});


quill.on('text-change', helper.throttle(() => {
    const delta = quill.getContents();
    const jsonDelta = JSON.stringify(delta);
    
    //send the jsonDelta to the api
    helper.modifyNoteContent(sessionStorage.getItem("currentNoteViewingName"), jsonDelta);

    //refresh the ui to show modified date
    helper.clearNoteListUI();
    helper.refreshNotesUI();

}, 10000));




