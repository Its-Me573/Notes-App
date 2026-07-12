import * as config from "../config.js";
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.4.1/dist/fuse.mjs'

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

export async function updateList (container, tagName) {
    try{
        let noteNames = await returnAllNoteNames();

        noteNames.forEach (function(item) {
            //Elements to be appended to an existing HTML container
            const nameElement = document.createElement(tagName);
            const dateModifiedElement = document.createElement("h6");

            const nameNode = document.createTextNode(item.note_name);
            const dateModifiedNode = document.createTextNode("Date Modified: " + item.date_modified);

            nameElement.appendChild(nameNode);
            dateModifiedElement.appendChild(dateModifiedNode);


            container.appendChild(nameElement);
            container.appendChild(dateModifiedElement);
        })
    }catch (error) {
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


