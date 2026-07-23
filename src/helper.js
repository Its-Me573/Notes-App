import * as config from "../config.js";
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.4.1/dist/fuse.mjs'

//api connection
export async function returnAllNoteNames () {
    try {
        const url = config.baseURL + "/notes";
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();        
        const returnArr = [];
        
        result.forEach ((item) => {
            returnArr.push(item);
        });

        return returnArr;

    }catch(error) {
        console.error(error.message);
    }
}

//api delete note
export async function deleteNote (targetNote) {
    try {
        const url = config.baseURL + "/note/" + targetNote;

        const response = await fetch(url, {
            method: "DELETE",
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    }catch(error) {
        console.error(error.message);
    }
}

//app initialization
//refreshes list of note names
export async function initializeApp () {
    let listOfNotes = await returnAllNoteNames();
    renderList(listOfNotes);
}

export function clearNoteListUI () {
    const parent = document.getElementById("scrollable-note-names");

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

export function renderList (listOfNotes) {
    try {
        listOfNotes.forEach((item) => {
            const notesContainer = document.getElementById("scrollable-note-names");

            //create button for viewing notes
            const noteButtonElement = document.createElement("button");
            const buttonName = document.createTextNode(item.note_name);
            noteButtonElement.setAttribute("note", item.note_name);
            noteButtonElement.setAttribute("class", "note-button");
            noteButtonElement.appendChild(buttonName);

            //create header showing a notes recent modified date
            const dateHeader = document.createElement("h6");
            const dateModifiedText = document.createTextNode("Date Modified: " + item.date_modified);
            dateHeader.setAttribute("class", "date-modified-header");
            dateHeader.appendChild(dateModifiedText);

            //create button to delete a certain note
            const deleteNoteButton = document.createElement("button");
            const deleteNoteIcon = document.createElement("img");
            deleteNoteIcon.src = "../images/trash-2.png";
            deleteNoteButton.setAttribute("class", "delete-note-button");
            deleteNoteButton.setAttribute("target-note", item.note_name);
            deleteNoteButton.appendChild(deleteNoteIcon);
            
            //append all notes to the notesContainer
            notesContainer.appendChild(noteButtonElement);
            notesContainer.appendChild(deleteNoteButton);
            notesContainer.appendChild(dateHeader);
        })
    }catch(error) {
        console.log(error.message);
        return [];
    }
}

//input the searchInput to find the result in the noteNames array
export function fuzzySearchResult (searchInput, noteNames) {
    const fuse = new Fuse(noteNames, {
        threshold: 0.3,
        keys: ["note_name"]
    });

    const result = fuse.search(searchInput);

    let normalizedArr = [];

    result.forEach((item) => {
        normalizedArr.push(item.item);
    })
    
    return normalizedArr;
}

export function showDeleteNoteDialog() {
   const dialog = document.getElementById("delete-note-dialog");
   dialog.showModal();
}

export function changeDeleteNoteDialogAttribute(noteName) {
    const dialog = document.getElementById("delete-note-button");
    dialog.setAttribute("data-type", noteName);
}

export function closeDeleteNoteDialog() {
   const dialog = document.getElementById("delete-note-dialog");
   dialog.close();
}


