const express = require("express");
// TODO: Remove body-parser from package JSON
//const BODY_PARSER = require('body-parser')
const path = require("path");
const GROCERY_LIST_MODULE = require("grocery_list");
const QueuedTaskManager = require("queued_tasks");

/*  Notes:
        According to online documentation:
            post -> Send info (so for server app.post is receive)
            get -> Get info (so for server app.post is sending data)

*/

// Global Constants
const FILE_NAME = "data/list.csv";
const app = express();
const port = 8080;
const groceryList = new GROCERY_LIST_MODULE.GroceryList();
const queuedTaskManager = new QueuedTaskManager(handleUserRequest);

// Global Variables
var currentUpdateID = 0;

// Functions

async function userRequestAdd(requestBody){
    // Ensure the add only goes through if it is received from a client on the current version
    if (requestBody["currentVersion"] != currentUpdateID){
        return {"success": false};
    }
    groceryList.addItemFromJSON(requestBody["data"]);
    await groceryList.saveToFile(FILE_NAME);
    currentUpdateID += 1;
    return {"success": true, "newVersion": currentUpdateID, "data": groceryList.toJSON()};
}

// Determines which function to use to handle the user request
async function handleUserRequest(request){
    let requestBody = request.body;
    let descriptionOfIssue = "Unknown purpose."; // Incase bad request
    try {
        if (requestBody["purpose"] == "add"){
            return await userRequestAdd(requestBody);
        }else if (requestBody["purpose"] == "delete"){
            return await userRequestDelete(requestBody);
        }else if (requestBody["purpose"] == "getLatestVersion"){
            return {"versionNumber": currentUpdateID, "data": groceryList.toJSON()};
        }else if (requestBody["purpose"] == "getVersionNumber"){
            return {"versionNumber": currentUpdateID};
        }
    }catch (exception){
        console.log("Exception in handleUserRequest:", exception);
        descriptionOfIssue = exception.toString(); // TODO: Maybe this is too much detail
    }
    // Else - Bad request
    return {"success": false, "description_of_issue": descriptionOfIssue};
}

// Start Up Setup Express

app.use(express.static('public')) // Provide access to public files
//app.use(BODY_PARSER.urlencoded({ extended: true })); // TODO: Does this make the request body show up?
app.use(express.json());

app.get("/", (req, res) => {
    const options = {
        root: path.join(__dirname)
    }
    res.sendFile("public/index.html", options, function(error){
        if (error){
            console.log(error);
            console.log("An error has occured.")
        }else{
            console.log("Sent to user.")
        }
    });
})

app.get("/updateVersion", (req, res) => {
    req.body["purpose"] = "getVersionNumber";
    let result = await queuedTaskManager.doTask(req);
    res.send(currentUpdateID.toString());

})

app.get("/getLatestVersion", (req, res) => {
    req.body["purpose"] = "getLatestVersion";
    let result = await queuedTaskManager.doTask(req);
    res.send(result);
})


app.post("/addItem", async function(req, res){
    /* Use a queue setup with QueuedTaskManager to handle these things one at a time so multiple clients
    don't mess things up */
    req.body["purpose"] = "add";
    let result = await queuedTaskManager.doTask(req);
    res.send(result);
})

app.post("/deleteItem", async function(req, res){
    req.body["purpose"] = "delete";
    let result = await queuedTaskManager.doTask(req);
    res.send(result);
})

app.listen(port, () => {
    console.log(`Grocery List Server Running on Port: ${port}`)
    // When server is running
    groceryList.readFromFile(FILE_NAME);
})

// Start Up (Before server is running / As server is starting up)