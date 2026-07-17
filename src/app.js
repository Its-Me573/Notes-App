import * as helper from "./helper.js";

helper.initializeApp();

document.getElementById("search-bar").addEventListener("input", async (e) => {
    //store the notes grabbed from the api call
    let noteNames = await helper.returnAllNoteNames();
    
    let results = helper.fuzzySearchResult(e.target.value, noteNames);

    helper.clearNoteListUI();

    helper.renderList(results);
})  