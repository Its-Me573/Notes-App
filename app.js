var arr = [
    "one",
    "two",
    "three"
];

var ul = document.getElementById("scrollable-note-names");
var note_index = 0;
arr.forEach(function(e){
    var list = document.createElement("button");
    var node = document.createTextNode(arr[note_index]);
    list.appendChild(node);

    ul.appendChild(list);
    console.log(list);
    note_index++;
})