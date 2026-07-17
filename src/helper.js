import * as config from "../config.js";
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.4.1/dist/fuse.mjs'

export async function initializeApp () {
    listLiveUpdate(document.getElementById("scrollable-note-names"), await returnAllNoteNames())
}

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

//will be used to update the contents of the list of notes on the left of the screen
//take in the notes as a promise
//will not take any parameters since this will have a single function which is updating the list properly

//update the contents of the list with information provided to the function
export async function listLiveUpdate (container, listOfNotes) {
    try {
        listOfNotes.forEach(function(item) {
            const nameElement = document.createElement("button");
            nameElement.setAttribute("note", item.note_name);

            const dateModifiedElement = document.createElement("h6");

            const nameNode = document.createTextNode(item.note_name);
            const dateModifiedNode = document.createTextNode("Date Modified: " + item.date_modified);

            nameElement.appendChild(nameNode);
            dateModifiedElement.appendChild(dateModifiedNode);

            container.appendChild(nameElement);
            container.appendChild(dateModifiedElement);
        })
    }catch(error) {
        console.log(error.message);
        return [];
    }
}


export async function clearNoteList () {
    const parent = document.getElementById("scrollable-note-names");
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

//this function is written horribly. live update list should
export async function liveUpdateList () {
    try{
        const input = document.querySelector("input");
        const log = document.getElementById("search-box");

        let allNoteNames = await returnAllNoteNames();

        //listen for a text input
        input.addEventListener("input", function (e) {
            const fuse = new Fuse(allNoteNames, {
                threshold: 0.2,
                keys: ["note_name"]
            });

            const results = fuse.search(e.target.value);

            //clear all note buttons in the list for refresh
            clearNoteList();

            //append notes
            results.forEach(function(object) {                
                //create new elements to append
                const nameElement = document.createElement("button");
                const dateModifiedElement = document.createElement("h6");

                //set the button to store the note and the name of the note
                nameElement.setAttribute("note", item.note_name);

                //create text nodes
                const nameNode = document.createTextNode(object.item.note_name);
                const dateModifiedNode = document.createTextNode("Date Modified: " + object.item.date_modified);

                const list = document.getElementById("scrollable-note-names");

                //append text nodes into created elements
                nameElement.appendChild(nameNode);
                dateModifiedElement.appendChild(dateModifiedNode);

                //append elements into the list
                list.appendChild(nameElement);
                list.appendChild(dateModifiedElement);
            })
        })
    }catch (error) {
        console.log(error.message);
        return [];
    }
}


