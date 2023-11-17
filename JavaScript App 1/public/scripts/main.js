console.log("Grocery Script Running!");

/*
    Notes:
        - Assuming that elements exist otherwise get an error. It's fine user can delete and give themself and error.
        - Assuming that if the function viewDetailsFor(index) is called, the index is valid.
            - Ex: A user could go to console and type viewDetailsFor(999) and produce an error
                - I don't care about this error because it was only encountered by a user sabotaging themself
        - Assuming all LI elements match up with an element in the grocery list
        - Assuming all LI elements have their class set
*/

// Global Constants
const itemIDRegex = /^listItem([0-9]+)$/;

// Global Variables
var groceryList = new GroceryList();
var lastUpdateID = -1; // Starts with -1 so will start out by taking version 0 (or higher if other connections have occured)
var awaitingRefresh = false;

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

function hasSelectedItem(){
    return document.querySelector(".selected") != null;
}

function getSelectedItemID(){
    let selectedItem = document.querySelector(".selected"); // Assumes only a proper item will have this class
    let selectedItemIDString = selectedItem.getAttribute("id");
    return parseInt(selectedItemIDString.match(itemIDRegex)[1]);
}

// Making lots of serious assumptions in this function
function resetItemDetails(){
    if (!hasSelectedItem()){ return; } 
    let selectedItem = groceryList.getByIndex(getSelectedItemID());
    document.getElementById("itemDetails_name").value = selectedItem.getName();
    document.getElementById("itemDetails_quantity").value = selectedItem.getQuantity();
    document.getElementById("itemDetails_description").value = selectedItem.getDescription();
}

function resetItemList(){
    let listUL = document.getElementById("list");
    // Delete all children & everything inside
    listUL.innerHTML = "";

    for (let i = 0; i < groceryList.getLength(); i++){
        let item = groceryList.getByIndex(i);
        let itemLI = document.createElement("li");
        itemLI.setAttribute("class", "listItem");
        itemLI.setAttribute("id", "listItem" + i.toString());
        let itemTextArea = document.createElement("textarea");
        itemTextArea.value = item.getName();
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
    resetItemDetails();
}

function saveCurrentItemDetails(){
    let currentlySelectedID = getSelectedItemID();
    let item = groceryList.getByIndex(currentlySelectedID);
    let name = document.getElementById("itemDetails_name").value;
    let quantity = document.getElementById("itemDetails_quantity").value;
    let description = document.getElementById("itemDetails_description").value;

    item.setName(name);
    item.setQuantity(quantity);
    item.setDescription(description);
}

async function refresh(){
    console.log("Try to refresh:", awaitingRefresh);
    // Run every 2 seconds unless request from previous is active
    if (awaitingRefresh){
        return;
    }
    awaitingRefresh = true;
    let response = await fetch("http://localhost:8080/updateVersion"); // TODO: This is hardcoded, change in the future
    let responseJSON = await response.json();
    let currentVersion = responseJSON;
    // If we are on an outdated version then update
    if (currentVersion > lastUpdateID){
        // Need to await so that the awaitingRefresh isn't set to false until we have updated
        await updateVersion();
    }
    // After received refresh
    awaitingRefresh = false;
}

async function updateVersion(){
    let response = await fetch("http://localhost:8080/getLatestVersion");
    let responseJSON = await response.json();
    // TODO: Update data based on the version from the cloud
    // TODO: Reset the display based on version from the cloud
}

// Start Up

// Listeners
addEventListener("DOMContentLoaded", (event) => {
    // Temp
    groceryList.addItem("my new item 1");
    groceryList.addItem("my new item 2");
    resetItemDisplay();


    document.getElementById("newListItem").addEventListener("keypress", function (event){ if (event.key === "Enter"){ newItem(); event.preventDefault(); }});
    
    let saveChangesButton = document.getElementById("itemDetails_saveChanges");
    saveChangesButton.addEventListener("click", function(event){
        if (saveChangesButton.classList.contains("readyButton")){
            saveCurrentItemDetails();
        }
        saveChangesButton.classList.remove("readyButton");
        saveChangesButton.classList.add("notReadyButton");
    })

    let allItemDescriptionTextAreas = document.querySelectorAll(".itemDetailsTextArea");
    for (let textArea of allItemDescriptionTextAreas){
        textArea.addEventListener("input", function(event){
            saveChangesButton.classList.remove("notReadyButton");
            saveChangesButton.classList.add("readyButton");
        });
    }

    setInterval(refresh, 2000);
}); 