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


//api createNote
export async function createNote (newNoteName) {
    try{
        const url = config.baseURL + "/note/";
    
        const currentDate = getCurrentDateAndTime();
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                name: newNoteName,
                content: "\u200B",
                date_created: currentDate,
                date_modified: currentDate
            })
        })
        

        if(response.status === 400) {
            

            return false;
        }

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    }catch(error) {
        console.error(error.message);
    }
}


function getCurrentDateAndTime() {
    const date = new Date();
    const hours = date.getHours();


    const currYear = date.getFullYear();
    const currMonth = date.getMonth() + 1;
    const currDay = date.getDate();
    const currMinute = date.getMinutes().toString().padStart(2, "0");
    const currHour = date.getHours() % 12 || 12;        


    const AMPM = hours >= 12 ? "PM" : "AM";


    const dateCreated = currMonth + "/" + currDay + "/" + currYear;
    const timeCreated = currHour + ":" + currMinute + AMPM;

    const returnFormat = dateCreated + " " + timeCreated;

    return returnFormat;
}


//refresh note list UI
export async function refreshNotesUI() {
    let listOfNotes = await returnAllNoteNames();
    // console.log(listOfNotes.length);

    if(listOfNotes.length === 0 ) {
        //append image to the scrollable note names container
        const notesContainer = document.getElementById("scrollable-note-names");
        
        const noNotesMessage = document.createElement("h1");
        const message = document.createTextNode("No Notes Yet");
        noNotesMessage.appendChild(message);

        // notesContainer.setAttribute("id", "no-notes");


        notesContainer.appendChild(noNotesMessage);
    }else {
        renderList(listOfNotes);
    }
}


//app initialization
//refreshes list of note names
export function initializeApp () {
    refreshNotesUI();
}


//should work
export function clearNoteListUI () {
    const parent = document.getElementById("scrollable-note-names");

    //console.log(parent.children);
    //problem with this line. the entire scrollable notes should not be removed
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


export function showDialog(elementID) {
   const dialog = document.getElementById(elementID);
   dialog.showModal();
}


//can modify existing attribute or add new attribute to container
export function modifyElementAttribute(target, attributeName, attributeData) {
    const element = document.getElementById(target);

    element.setAttribute(attributeName, attributeData);
}


//Will allow for all buttons with class name close-dialog to close the current dialog popup
export function closeDialog(dialogID) {
    const dialog = document.getElementById(dialogID);
    dialog.close();
}


//get the information from a text input and store it
export function getTextElementInput(textInputElementID) {

    return document.getElementById(textInputElementID).value;     
}

export async function doNotesExist() {

    const allNotes = await returnAllNoteNames();

    if(allNotes.length === 0) {
        return false;
    }

    return true;
}

