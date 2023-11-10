console.log("Grocery Script Running!");

/*
    Notes:
        - Assuming that elements exist otherwise get an error. It's fine user can delete and give themself and error.
        - Assuming that if the function viewDetailsFor(index) is called, the index is valid.
            - Ex: A user could go to console and type viewDetailsFor(999) and produce an error
                - I don't care about this error because it was only encountered by a user sabotaging themself
        - All LI elements match up with an element in the grocery list
        - All LI elements have their class set
*/

// Global Variables
var groceryList = new GroceryList();

// Functions
function newItem(){
    let textArea = document.getElementById("newListItemTextArea");
    let text = textArea.value;
    if (text === ""){
        return;
    }

    // Reset the text
    textArea.value = "";
    groceryList.addItem(text);
    resetItemDisplay();
}

function resetItemDisplay(){
    resetItemDetails();
    resetItemList();
}

function resetItemDetails(){
    // TODO
}

function resetItemList(){
    let items = groceryList.getList();
    let listUL = document.getElementById("list");
    // Delete all children & everything inside
    listUL.innerHTML = "";

    for (let i = 0; i < items.length; i++){
        let item = items[i];
        let itemLI = document.createElement("li");
        itemLI.setAttribute("class", "listItem");
        itemLI.setAttribute("id", "listItem" + i.toString());
        let itemTextArea = document.createElement("textarea");
        itemTextArea.value = item["name"];
        itemTextArea.setAttribute("spellcheck", "false");
        itemTextArea.setAttribute("class", "listItemTextArea");
        itemTextArea.setAttribute("readonly", "true");
        itemLI.addEventListener("click", function(event){ viewDetailsFor(i); });
        itemLI.appendChild(itemTextArea);
        listUL.appendChild(itemLI);
    }
}

function getData(){
    navigator.clipboard.writeText(groceryList.toDataString());
}

function enterData(dataJSON){
    groceryList.fromDataJSON(dataJSON);
    resetItemDisplay();
}

function viewDetailsFor(index){
    deselectAll();
    select(index);
    let item = groceryList.getByIndex(index);
    let detailsContainer = document.getElementById("listItemDetailsContainer");
    detailsContainer.style = ""; // Remove hidden
    document.getElementById("itemDetails_name").innerHTML = item["name"];

}

function deselectAll(){
    let items = groceryList.getList();
    for (let i = 0; i < items.length; i++){
        let itemLI = document.getElementById("listItem" + i.toString());
        itemLI.classList.remove("selected");
    }
}

function select(index){
    let item = document.getElementById("listItem" + index.toString());
    item.classList.add("selected");
}



// Listeners
addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("newListItem").addEventListener("keypress", function (event){ if (event.key === "Enter"){ newItem(); event.preventDefault(); }});
}); 