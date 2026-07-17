import * as config from "../config.js";
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.4.1/dist/fuse.mjs'

//api connection
export async function returnAllNoteNames () {
    try{
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

    }catch (error) {
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
            const nameElement = document.createElement("button");
            nameElement.setAttribute("note", item.note_name);

            const dateModifiedElement = document.createElement("h6");

            const nameNode = document.createTextNode(item.note_name);
            const dateModifiedNode = document.createTextNode("Date Modified: " + item.date_modified);

            nameElement.appendChild(nameNode);
            dateModifiedElement.appendChild(dateModifiedNode);

            const container = document.getElementById("scrollable-note-names")

            container.appendChild(nameElement);
            container.appendChild(dateModifiedElement);
        })
    }catch(error) {
        console.log(error.message);
        return [];
    }
}

//input the searchInput to find the result in the noteNames array
export function fuzzySearchResult (searchInput, noteNames) {
    const fuse = new Fuse(noteNames, {
        threshold: 0.2,
        keys: ["note_name"]
    });

    const result = fuse.search(searchInput);

    let normalizedArr = [];

    result.forEach((item) => {
        normalizedArr.push(item.item);
    })
    
    return normalizedArr;
}


