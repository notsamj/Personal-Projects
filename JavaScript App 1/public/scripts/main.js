console.log("Grocery Script Running!");

/*
    Notes:
        - Assuming that elements exist otherwise get an error. It's fine user can delete and give themself and error.
        - Assuming that if the function viewDetailsFor(index) is called, the index is valid.
            - Ex: A user could go to console and type viewDetailsFor(999) and produce an error
                - I don't care about this error because it was only encountered by a user sabotaging themself
        - Assuming all LI elements match up with an element in the grocery list
        - Assuming all LI elements have their class set

    TODO:
        - Remove hardcoding of 8080 or just make a constant
*/

// Global Constants
const itemIDRegex = /^listItem([0-9]+)$/;

// Global Variables
var groceryList = new GroceryList();
var lastUpdateReceived = -1; // Starts with -1 so will start out by taking version 0 (or higher if other connections have occured)
var refreshInProgress = false;

// Functions

async function deleteItem(){
    let index = getSelectedItemID();
    let serverResponseJSON = await informServerOfDeletedItem(index); // Not the best, not the worst imo
    // Deselect item being selected
    if (serverResponseJSON["success"]){
        let itemElement = document.querySelector(".selected");
        itemElement.classList.remove("selected");
        lastUpdateReceived = serverResponseJSON["newVersion"];
        loadFromJSONData(serverResponseJSON["data"])
    }else{
        // TODO: ToolTip: Server not responding...
    }
}

async function newItem(){
    let textArea = document.getElementById("newListItemTextArea");
    let itemName = textArea.value;
    if (itemName === ""){
        return;
    }

    let serverResponseJSON = await informServerOfNewItem(itemName); // Not the best, not the worst imo
    if (serverResponseJSON["success"]){
        lastUpdateReceived = serverResponseJSON["newVersion"];
        textArea.value = "";
        loadFromJSONData(serverResponseJSON["data"])
    }else{
        // TODO: ToolTip: Server not responding...
    }
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
    if (!hasSelectedItem()){
        document.getElementById("listItemDetailsContainer").style = "display: none";
        return; 
    }
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

async function saveCurrentItemDetails(){
    let currentlySelectedID = getSelectedItemID();
    let item = groceryList.getByIndex(currentlySelectedID);
    let itemCopy = item.copy();
    let name = document.getElementById("itemDetails_name").value;
    let quantity = document.getElementById("itemDetails_quantity").value;
    let description = document.getElementById("itemDetails_description").value;

    itemCopy.setName(name);
    itemCopy.setQuantity(quantity);
    itemCopy.setDescription(description);
    let itemCopyJSON = itemCopy.toJSON();
    let serverResponseJSON = await informServerOfItemUpdate(getSelectedItemID(), itemCopyJSON);
    if (serverResponseJSON["success"]){
        item.copyDetailsFromJSON(itemCopyJSON);
        lastUpdateReceived = serverResponseJSON["newVersion"];
        let saveChangesButton = document.getElementById("itemDetails_saveChanges");
        saveChangesButton.classList.remove("readyButton");
        saveChangesButton.classList.add("notReadyButton");
    }else{
        // TODO: ToolTip: Server not responding...
    }
}

async function refresh(){
    //console.log("Try to refresh:", refreshInProgress);
    // Run every 2 seconds unless request from previous is active
    if (refreshInProgress){
        return;
    }
    refreshInProgress = true;
    let response = await fetch("http://localhost:8080/updateVersion"); // TODO: This is hardcoded, change in the future
    let responseJSON = await response.json();
    let currentVersion = responseJSON;
    // If we are on an outdated version then update
    if (currentVersion > lastUpdateReceived){
        console.log("Out of date -> Updating: {currentVersion} {lastUpdateReceived}", currentVersion, lastUpdateReceived);
        // Need to await so that the refreshInProgress isn't set to false until we have updated
        await updateVersion();
    }
    // After received refresh
    refreshInProgress = false;
}

async function informServerOfDeletedItem(itemIndex){
    let response = await fetch("http://localhost:8080/deleteItem", {
        method: "POST",
        body: JSON.stringify({
            "currentVersion": lastUpdateReceived,
            "data": itemIndex
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    return response.json();
}

async function informServerOfNewItem(itemName){
    let response = await fetch("http://localhost:8080/addItem", {
        method: "POST",
        body: JSON.stringify({
            "currentVersion": lastUpdateReceived,
            "data": itemName
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    return response.json();
}

async function informServerOfItemUpdate(index, newItemJSON){
    let response = await fetch("http://localhost:8080/updateItem", {
        method: "POST",
        body: JSON.stringify({
            "currentVersion": lastUpdateReceived,
            "index": index,
            "data": newItemJSON
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    return response.json();
}

function loadFromJSONData(data){
    groceryList.fromDataJSON(data);
    resetItemDisplay();
}

async function updateVersion(){
    let response = await fetch("http://localhost:8080/getLatestVersion");
    if (response.status != 200){ // If not a successful response
        return;
    }
    let responseJSON = await response.json();
    let versionNumber = responseJSON["versionNumber"];
    let data = responseJSON["data"];
    lastUpdateReceived = versionNumber;
    loadFromJSONData(data);
}

// Start Up

// Listeners
addEventListener("DOMContentLoaded", (event) => {
    // Temp
    groceryList.addItem("my new item 1");
    groceryList.addItem("my new item 2");
    resetItemDisplay();
    // END Temp

    document.getElementById("newListItem").addEventListener("keypress", function (event){ if (event.key === "Enter"){ newItem(); event.preventDefault(); }});
    
    let saveChangesButton = document.getElementById("itemDetails_saveChanges");
    saveChangesButton.addEventListener("click", function(event){
        if (saveChangesButton.classList.contains("readyButton")){
            saveCurrentItemDetails();
        }
    })

    let allItemDescriptionTextAreas = document.querySelectorAll(".itemDetailsTextArea");
    for (let textArea of allItemDescriptionTextAreas){
        textArea.addEventListener("input", function(event){
            saveChangesButton.classList.remove("notReadyButton");
            saveChangesButton.classList.add("readyButton");
        });
    }

    let deleteButton = document.getElementById("deleteButton");
    deleteButton.addEventListener("click", function(event){
        deleteItem();
    });

    refresh();
    setInterval(refresh, 2000);
}); 