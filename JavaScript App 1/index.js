const express = require("express");
const path = require("path");
const GROCERY_LIST_MODULE = require("grocery_list");
const app = express();
const port = 8080;
const grocceryList = new GROCERY_LIST_MODULE.GroceryList();

// Functions

// Start Up Setup Express

app.use(express.static('public')) // Provide access to public files

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

app.post("get_list", (req, res) => {
    res.send(grocceryList.toJSON());
})

app.post("set_list", (req, res) => {
    let status = true; // Change to false if there is an issue setting
    // TODO
    res.send(status);
})

app.listen(port, () => {
    console.log(`Grocery List Server Running on Port: ${port}`)
    // When server is running
    grocceryList.readFromFile("data/list.csv");
})

// Start Up (Before server is running / As server is starting up)