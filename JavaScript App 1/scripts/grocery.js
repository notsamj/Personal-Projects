console.log("Grocery Script Running!");

/*
    Notes:
        - Assuming that elements exist otherwise get an error. It's fine user can delete and give themself and error.
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
    // TODO
}

function getData(){
    console.log(groceryList.toDataString());
}

function enterData(dataJSON){
    groceryList.fromDataJSON(dataJSON);
}



// Listeners
addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("newListItem").addEventListener("keypress", function (event){ if (event.key === "Enter"){ newItem(); event.preventDefault(); }});
}); 