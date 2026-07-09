import * as config from "../config.js";


export async function returnAllNoteNames() {
    try{
        const url = config.baseURL + "/notes";
        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();        
        const returnArr = [];
        
        result.forEach((item) => {
            returnArr.push(item);
        });

        return returnArr;

    }catch(error){
        console.error(error.message);
    }
}

export async function updateList(container, tagName){
    try{
        let noteNames = await returnAllNoteNames();

        noteNames.forEach(function(item){
            //Elements to be appended to an existing HTML container
            const nameElement = document.createElement(tagName);
            const dateModifiedElement = document.createElement("h6");

            const nameNode = document.createTextNode(item.note_name );
            const dateModifiedNode = document.createTextNode("Date Modified: " + item.date_modified);

            nameElement.appendChild(nameNode);
            dateModifiedElement.appendChild(dateModifiedNode);


            container.appendChild(nameElement);
            container.appendChild(dateModifiedElement);
        })
    }catch(error){
        console.log(error.message);
        return [];
    }
}

