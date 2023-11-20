const express = require("express");
const BODY_PARSER = require('body-parser')
const path = require("path");
const GROCERY_LIST_MODULE = require("grocery_list");
const QueuedTaskManager = require("queued_tasks");

/*  Notes:
        According to online documentation:
            post -> Send info (so for server app.post is receive)
            get -> Get info (so for server app.post is sending data)

*/

// Global Constants
const app = express();
const port = 8080;
const grocceryList = new GROCERY_LIST_MODULE.GroceryList();
const queuedTaskManager = new QueuedTaskManager(handleUserRequest);

// Global Variables
var currentUpdateID = 0;

// Functions

// Determines which function to use to handle the user request
async function handleUserRequest(request){
    console.log("Request:", request);
    let details = request._body;
    console.log("handleUserRequest received:", details);
    if (details["purpose"] == "add"){
        return userRequestAdd();
    }else if (details["purpose"] == "delete"){
        return userRequestDelete();
    }
    // Else - Bad request
    return {"success": false, "description_of_issue": "Unknown purpose."};
}

// Start Up Setup Express

app.use(express.static('public')) // Provide access to public files
app.use(BODY_PARSER.urlencoded({ extended: true })); // TODO: Does this make the request body show up?

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
    res.send(currentUpdateID.toString());  
})

app.get("/getLatestVersion", (req, res) => {
    res.send({"versionNumber": currentUpdateID, "data": grocceryList.toJSON()});  
})


app.post("/addItem", async function(req, res){
    /* TODO: Add a queue setup with QueuedTaskManager to handle these things one at a time so multiple clients
    don't mess things up */
    console.log("Body", req.body);
    let result = await queuedTaskManager.doTask(req);
    res.send(result);
})

app.listen(port, () => {
    console.log(`Grocery List Server Running on Port: ${port}`)
    // When server is running
    grocceryList.readFromFile("data/list.csv");
})

// Start Up (Before server is running / As server is starting up)