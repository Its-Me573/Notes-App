const port = "http://127.0.0.1:8000";

export async function returnAllNoteNames() {
    try{
        const url = port + "/notes";
        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();        
        const returnArr = [];
        
        result.forEach((item) => {
            returnArr.push(item.note_name);
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
            const element = document.createElement(tagName);
            const node = document.createTextNode(item);
            element.appendChild(node);
            container.appendChild(element);
        })
    }catch(error){
        console.log(error.message);
        return [];
    }
}
